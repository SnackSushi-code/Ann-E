# Phase 2: Core Runtime Foundation

## 1. Purpose and scope

This phase starts the Windows desktop application with a small working connection between its user interface and local Rust runtime. It establishes a place to build on while keeping local computer access and model connections disabled.

The work covers the desktop shell, one runtime status command, a narrow Tauri permission, basic frontend and Rust checks, and local setup instructions. Model providers, memory, plugins, agent orchestration, file access, browser access, and computer control are outside this phase.

## 2. Investigation and implementation

The `main` branch contained only `README.md` and `MASTER_PLAN.md`; there was no application code, dependency manifest, test suite, or CI workflow. Node.js 22 and Rust were available in the development environment.

I used the official Tauri starter as a base, then replaced its sample greeting screen with an Ann-E desktop shell built with React and TypeScript. The Rust side now returns the app name, version, and local runtime state. The UI reports “connected” only after that command responds with the expected app name and ready state.

The starter also included an external-link plugin and a null content security policy. I removed the plugin and narrowed the content security policy. The Tauri capability grants the webview one custom command, `get_runtime_status`; it does not grant file, shell, browser, or computer-control access.

## 3. Bugs, failures, and unexpected findings

- The first `npm install` using the machine’s npm 10 failed inside npm’s dependency resolver with `Cannot read properties of null (reading 'edgesOut')`. The exact internal cause was not established.
- The first Rust check found that the generated Rust entry point still imported the starter’s opener plugin after it had been removed from the manifest. I removed that leftover plugin call.
- The first test run could not create a temporary Vitest file under the sandbox’s system temp directory. Directing `TEMP` and `TMP` to the ignored, repository-local `.tmp` folder allowed the tests to run.
- Tauri initially waited for Vite because the sandbox blocked access to `localhost:1420`. With local network access enabled for the development process, Tauri compiled and opened the app.
- The first formatting check found a formatting difference in `build.rs`; `cargo fmt` fixed it.

## 4. Root causes and fixes

The npm resolver failure occurred before a lockfile existed. I generated `package-lock.json` with npm 12, then confirmed that npm 10 can install that lockfile with `npm ci --ignore-scripts` in a temporary copy. The README now uses `npm ci` for repeatable installs.

The opener build error came from starter code that remained after removing the dependency. Removing the plugin call resolved it. The sandbox temp and loopback errors were environment restrictions rather than app defects; using a project-local temp folder and allowing the local Tauri development process to reach Vite resolved them.

## 5. Testing and actual results

- `npm test -- --reporter=dot`: passed, 3 tests.
- `npm run build`: passed; TypeScript check and Vite production build completed.
- `cargo test --offline`: passed, 1 integration test; library, binary, and doc-test targets had no additional tests.
- `cargo fmt -- --check`: passed after running `cargo fmt`.
- `npm ci --ignore-scripts` with npm 10: passed in a temporary copy of the package manifest and lockfile; npm reported 0 vulnerabilities.
- `npm run tauri dev`: passed with local network access. The Windows window opened, and the UI showed “Local runtime connected” from the Rust command.

Cargo printed a warning that incremental compilation could not hard-link files in this environment and copied them instead. It did not affect the test result.

## 6. Remaining limitations, risks, and follow-up work

This build is a desktop shell and status check; it does not call an AI model or use local tools. The connection-error screen is implemented, but the frontend tests cover a non-ready response rather than a rejected Tauri call. The app has been run in development mode, but a packaged Windows installer has not been built. The repository still has no CI workflow.

Next, define the provider connection and credential flow before adding model access. Keep credentials in an OS-backed secret store, and expose each new capability through a small, reviewed permission rather than expanding the webview’s access by default.
