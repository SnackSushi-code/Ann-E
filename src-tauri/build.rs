fn main() {
    tauri_build::try_build(tauri_build::Attributes::new().app_manifest(
        tauri_build::AppManifest::new().commands(&[
            "get_runtime_status",
            "get_gemini_key_status",
            "save_gemini_api_key",
            "clear_gemini_api_key",
            "test_gemini_connection",
            "chat_with_gemini",
        ]),
    ))
    .expect("failed to generate the Tauri application manifest");
}
