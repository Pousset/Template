use tauri_plugin_shell::ShellExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

     let backend_path = "C:\\Users\\mathi\\Documents\\GitHub\\Template\\App\\backend\\dist-bin\\index.js";
app.shell()
  .command("node")
  .args([backend_path])
  .env("NODE_ENV", "development")
  .env("DATABASE_PATH", "app.sqlite")
  .env("JWT_SECRET", "dev-secret-temporaire")
  .env("GOOGLE_CLIENT_ID", "placeholder")
  .env("GOOGLE_CLIENT_SECRET", "placeholder")
  .env("GOOGLE_CALLBACK_URL", "http://localhost:3001/auth/google/callback")
  .env("FRONTEND_URL", "http://localhost:5173")
  .env("ADMIN_USERNAME", "admin")
  .env("ADMIN_PASSWORD", "adminadmin")
  .spawn()
  .expect("Impossible de démarrer le backend");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}