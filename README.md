# Ann-E | Engineering AI

Ann-E is a personal AI assistant being developed to bring software engineering, computer engineering, research, and technical problem-solving together in one adaptable platform.

The goal is to create an assistant that understands ongoing work, retains useful context, collaborates with multiple AI models, and uses authorized tools to help carry projects from an initial idea through implementation and testing. Ann-E is intended to grow beyond a single chat interface or model provider through a modular architecture that can support new capabilities over time.

## Current Build

The first Windows desktop build uses Tauri, React, TypeScript, and a small Rust core. Its main window asks the local Rust process for a status and shows whether that connection is ready. This is a starting point for the app, not a provider-connected assistant yet.

Model providers, project memory, file access, browser access, and computer-control tools are not enabled in this build. The webview can call one Rust command: `get_runtime_status`.

## Run on Windows

You need Node.js, Rust with the MSVC toolchain, Microsoft C++ Build Tools with “Desktop development with C++”, and WebView2. Most Windows 10 and Windows 11 computers already have WebView2. The [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/#windows) page has the latest setup details.

From the repository root, install dependencies and open the desktop app:

```powershell
npm ci
npm run tauri dev
```

Run the checks from the repository root:

```powershell
npm test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

## What Ann-E Aims to Become

- **Multi-model collaboration:** Work with AI providers such as OpenAI and Google Gemini. Models should be able to examine tasks independently, review one another's findings, and help identify mistakes.
- **Persistent memory:** Retain useful conversations, project decisions, and task history so work can continue across sessions and, eventually, across authorized devices.
- **The Colony:** Provide a visual environment for specialized AI agents. Each worker should have clear responsibilities, reflect its real task status, coordinate with other agents, and ask for human input when blocked or when approval is needed.
- **An extensible plugin system:** Allow Ann-E to discover, install, configure, authorize, and use integrations for services and development tools, including GitHub and compatible MCP servers.
- **Engineering and development assistance:** Support programming, debugging, embedded systems, technical research, documentation, and broader engineering workflows.
- **Voice, browser, and desktop interaction:** Provide natural voice communication, browser automation, and carefully permissioned interaction with authorized desktop applications.
- **Continuity across devices:** Make relevant conversations, project context, and task history available across authorized computers.

These are the intended goals of the project, not claims that every capability is already implemented. Ann-E will evolve incrementally as its architecture and capabilities are developed and verified.

---

*Ann-E is an independent development project.*
