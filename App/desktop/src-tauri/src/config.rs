use std::path::PathBuf;

pub struct BackendEnv {
    pub vars: Vec<(String, String)>,
}

impl BackendEnv {
    pub fn from_env_or_defaults(db_path: &PathBuf) -> Self {
        let get = |key: &str, default: &str| {
            std::env::var(key).unwrap_or_else(|_| default.to_string())
        };

        Self {
            vars: vec![
                ("NODE_ENV".into(), if cfg!(debug_assertions) { "development".into() } else { "production".into() }),
                ("DATABASE_PATH".into(), db_path.to_str().unwrap().into()),
                ("JWT_SECRET".into(), get("APP_JWT_SECRET", "dev-secret-temporaire")),
                ("ADMIN_USERNAME".into(), get("APP_ADMIN_USERNAME", "admin")),
                ("ADMIN_PASSWORD".into(), get("APP_ADMIN_PASSWORD", "adminadmin")),
                ("GOOGLE_CLIENT_ID".into(), get("APP_GOOGLE_CLIENT_ID", "placeholder")),
                ("GOOGLE_CLIENT_SECRET".into(), get("APP_GOOGLE_CLIENT_SECRET", "placeholder")),
                ("GOOGLE_CALLBACK_URL".into(), get("APP_GOOGLE_CALLBACK_URL", "http://localhost:3001/auth/google/callback")),
                ("FRONTEND_URL".into(), get("APP_FRONTEND_URL", "http://localhost:5173")),
            ],
        }
    }

    pub fn to_vec(&self) -> Vec<(String, String)> {
        self.vars.clone()
    }
}