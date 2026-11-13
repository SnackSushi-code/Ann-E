use serde::Serialize;

#[derive(Debug, Eq, PartialEq, Serialize)]
pub struct RuntimeStatus {
    pub application: &'static str,
    pub state: &'static str,
    pub version: &'static str,
}

#[tauri::command]
pub fn get_runtime_status() -> RuntimeStatus {
    RuntimeStatus {
        application: "Ann-E",
        state: "ready",
        version: env!("CARGO_PKG_VERSION"),
    }
}
