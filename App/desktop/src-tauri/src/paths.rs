use std::path::PathBuf;

pub fn backend_path(resource_dir: Option<PathBuf>) -> PathBuf {
    if cfg!(debug_assertions) {
        PathBuf::from("../../backend/dist-bin/index.js")
    } else {
        resource_dir
            .expect("resource_dir manquant")
            .join("backend")
            .join("index.js")
    }
}

pub fn database_path(app_data_dir: &PathBuf) -> PathBuf {
    app_data_dir.join("app.sqlite")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn backend_path_debug() {
        let p = backend_path(None);
        assert_eq!(p, PathBuf::from("../../backend/dist-bin/index.js"));
    }
}