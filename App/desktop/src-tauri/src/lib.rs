use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_notification::NotificationExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_notification::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Sidecar backend — chemin dynamique selon dev/prod
      let backend_path: PathBuf = if cfg!(debug_assertions) {
        PathBuf::from("../../backend/dist-bin/index.js")
      } else {
        app
          .path()
          .resource_dir()
          .expect("Impossible de résoudre le dossier resources")
          .join("backend")
          .join("index.js")
      };

      // Dossier de données de l'app (AppData/Roaming sur Windows)
      let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Impossible de résoudre le dossier de données");

      fs::create_dir_all(&app_data_dir)
        .expect("Impossible de créer le dossier de données");

      let database_path = app_data_dir.join("app.sqlite");

      app.shell()
        .command("node")
        .args([backend_path.to_str().expect("Chemin invalide")])
        .env("NODE_ENV", if cfg!(debug_assertions) { "development" } else { "production" })
        .env("DATABASE_PATH", database_path.to_str().expect("Chemin invalide"))
        .env("JWT_SECRET", "dev-secret-temporaire")
        .env("GOOGLE_CLIENT_ID", "placeholder")
        .env("GOOGLE_CLIENT_SECRET", "placeholder")
        .env("GOOGLE_CALLBACK_URL", "http://localhost:3001/auth/google/callback")
        .env("FRONTEND_URL", "http://localhost:5173")
        .spawn()
        .expect("Impossible de démarrer le backend");

      // Notification de démarrage
      app.notification()
        .builder()
        .title("App")
        .body("Backend démarré et prêt.")
        .show()
        .expect("Impossible d'envoyer la notification");

      // System tray
      let show = MenuItem::with_id(app, "show", "Afficher", true, None::<&str>)?;
      let quit = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show, &quit])?;

      TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show" => {
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
          "quit" => app.exit(0),
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
        })
        .build(app)?;

      Ok(())
    })
    .on_window_event(|window, event| {
      if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        api.prevent_close();
        let _ = window.hide();
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}