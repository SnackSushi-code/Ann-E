pub mod status;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![status::get_runtime_status])
        .run(tauri::generate_context!())
        .expect("failed to run the Ann-E desktop application");
}
