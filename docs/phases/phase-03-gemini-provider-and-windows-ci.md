# Phase 3: Gemini provider and Windows checks — implementation progress

## 1. Purpose and scope

This phase adds the first model-provider path to the Windows desktop app and gives the project repeatable checks on a Windows GitHub runner. It covers a Gemini key field, Windows Credential Manager storage, a real connection-test command, a small text conversation, backend validation, frontend and Rust tests, a Windows Actions workflow, and a learning guide.

OpenAI support, other Gemini features, persistent conversation history, streaming responses, automatic retries, tool use, file access, browser access, computer control, and a packaged installer are outside this slice.

## 2. Investigation and implementation

Before editing, I checked the current local source, the master plan, the open desktop-foundation PR (#2), repository branches, recent commits, issues, and tests. PR #2 is still open against `main`; the repository had no open issues and no CI workflow. The current app had a narrow Tauri command for runtime status but no provider adapter or credential flow.

I kept the provider request on the Rust side. The webview can save a key, check whether one is present, remove it with confirmation, test the provider, and send chat messages through a specific allowlist of Tauri commands. The key is stored through the `keyring` crate in Windows Credential Manager. It is not returned to the webview, written to a URL, or committed to the repository.

The adapter uses Google's Interactions API with `gemini-3.8-flash`. It sends the API key in a marked-sensitive HTTPS header, disables HTTP redirects, asks the API not to store the interaction (`store: false`), limits request size and time, and reports provider errors without copying raw response bodies into the UI. Each request includes up to 20 recent chat messages so follow-up questions have context; those messages live only in the open app window.

The UI reports Gemini as connected only after the connection test or a chat request returns successfully. I added Windows Actions checks for frontend tests/build, Rust formatting/tests, and a Windows Tauri build without installer packaging. The learning note follows the request across the frontend, Tauri permissions, Rust, Windows Credential Manager, and Gemini.

## 3. Bugs, failures, and unexpected findings

- The first provider UI test failed because `GeminiPanel` did not exist yet. I added the component and its behavior, after which that test passed.
- A test-first change caught that earlier messages were displayed but not sent to Gemini. The provider request now sends bounded conversation context, and a Rust test checks that user and model messages retain their order.
- The first frontend production build found that `Array.at()` is not available under the project's ES2020 TypeScript library. I changed the test to use indexed access.
- The initial unprivileged Cargo request could not reach crates.io. After the dependency download was allowed, Cargo resolved and locked the provider dependencies and compiled them on Windows.
- Cargo printed a warning that incremental build files could not be hard-linked in this workspace and were copied instead. The warning did not fail the build or tests.

## 4. Root causes and fixes

The first UI test failure was expected: it demonstrated the provider panel behavior before the component was implemented. The test passed after the component and invoke calls were added.

The missing conversation context was an integration gap between the visible message list and the Tauri command arguments. Sending a validated, size-limited list of user/model messages fixed that gap while keeping server-side interaction storage disabled.

The TypeScript failure came from using a JavaScript array helper newer than the configured target library. Indexed access fits the existing ES2020 target, so I kept the project target unchanged.

The Cargo failure was caused by restricted network access, not by a Rust source error. The dependency download and later build ran successfully once that access was permitted.

## 5. Testing and actual results

- `npm test`: passed, 7 frontend tests across 2 files.
- `npm run build`: passed; TypeScript and Vite production build completed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: passed.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: passed, 7 provider unit tests and 1 existing runtime integration test.
- `npm run tauri -- build --no-bundle`: passed on Windows and produced `src-tauri/target/release/ann-e.exe`. This did not package an installer.
- GitHub Actions run #3 for implementation commit `ea2ab3f` completed successfully on a Windows runner. Frontend tests/build, Rust formatting/tests, and the Tauri desktop build all passed.
- I did not send a real Gemini request because no API key was configured for this test. The live provider path and this Windows account's credential-store behavior still need a user-key check in the app.

## 6. Remaining limitations, risks, and follow-up work

This is an implementation progress record, not evidence that a Gemini account is connected. To verify the provider end to end, open Ann-E, save a Gemini API key from Google AI Studio, and choose **Test Gemini connection**. That action sends a short real request and may count against the Google account's usage or limits.

Conversation history is temporary and limited to the open window. There is no streaming, retry/backoff, usage-cost reporting, model selector, or second provider yet. Windows CI still needs to complete on the updated PR. A signed or packaged installer has not been built.
