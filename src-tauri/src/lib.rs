pub mod providers;
pub mod status;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            status::get_runtime_status,
            providers::gemini::get_gemini_key_status,
            providers::gemini::save_gemini_api_key,
            providers::gemini::clear_gemini_api_key,
            providers::gemini::test_gemini_connection,
            providers::gemini::chat_with_gemini
        ])
        .run(tauri::generate_context!())
        .expect("failed to run the Ann-E desktop application");
}
