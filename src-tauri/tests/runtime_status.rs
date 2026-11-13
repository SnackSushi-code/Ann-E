use ann_e_lib::status::get_runtime_status;

#[test]
fn runtime_status_names_the_app_and_reports_the_running_core() {
    let status = get_runtime_status();

    assert_eq!(status.application, "Ann-E");
    assert_eq!(status.state, "ready");
    assert_eq!(status.version, env!("CARGO_PKG_VERSION"));
}
