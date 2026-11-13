fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new()
            .app_manifest(tauri_build::AppManifest::new().commands(&["get_runtime_status"])),
    )
    .expect("failed to generate the Tauri application manifest");
}
