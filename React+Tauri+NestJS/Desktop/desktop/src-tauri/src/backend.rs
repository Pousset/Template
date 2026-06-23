use tauri::{AppHandle, Manager};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use crate::paths::{backend_path, database_path};
use crate::config::BackendEnv;

pub fn spawn_backend(app: &AppHandle) -> tauri::Result<()> {
    log::info!("Démarrage du backend...");

    let resource_dir = app.path().resource_dir().ok();
    let backend_path = backend_path(resource_dir);

    log::info!("Chemin résolu: {}", backend_path.display());
    log::info!("Existe: {}", backend_path.exists());

    let app_data_dir = app.path().app_data_dir()
        .expect("Impossible de résoudre le dossier de données");
    std::fs::create_dir_all(&app_data_dir)?;

    let db_path = database_path(&app_data_dir);
    let env = BackendEnv::from_env_or_defaults(&db_path);

    let (mut rx, _child) = app.shell()
        .command("node")
        .args([backend_path.to_str().expect("Chemin invalide")])
        .envs(env.to_vec())
        .spawn()
        .expect("Impossible de démarrer le backend");

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => log::info!("[backend stdout] {}", String::from_utf8_lossy(&line)),
                CommandEvent::Stderr(line) => log::error!("[backend stderr] {}", String::from_utf8_lossy(&line)),
                CommandEvent::Error(err) => log::error!("[backend error] {}", err),
                CommandEvent::Terminated(payload) => log::warn!("[backend terminated] {:?}", payload),
                _ => {}
            }
        }
    });

    log::info!("Backend spawné");
    Ok(())
}