# Ann-E — Master Development Plan
## Engineering AI | Unified Intelligence, Agent Colony, Plugins, Memory & Multi-Device Architecture

**Repository:** https://github.com/SnackSushi-code/Ann-E  
**Canonical repository:** `SnackSushi-code/Ann-E`  
**Default branch observed during plan creation:** `main`  
**Status:** Product and architecture specification; implementation status must be verified against code and tests.  
**Initial development environment:** Windows 11  
**Future environments:** Linux workstations, additional computers, and optional mobile clients.

> This document is the canonical product and architecture direction for Ann-E. It is a target specification, not a claim that all listed capabilities already exist. Before implementing any feature, inspect the current repository and document the actual state.

---

# 1. Project Vision

Ann-E is a personal intelligent engineering assistant inspired by J.A.R.V.I.S. She is intended to become a persistent, extensible assistant that can understand requests, manage projects, write and review code, perform engineering tasks, research technical information, coordinate specialized AI agents, and interact with authorized software and hardware.

Ann-E must not be permanently tied to one computer, AI provider, operating system, repository, interface, or fixed set of capabilities. The architecture should support growth without requiring the entire application to be rewritten.

## Core objectives

- Reliable AI runtime with multiple model providers.
- Persistent conversation, project, and task memory.
- Independent AI collaboration and review.
- A visual Colony of specialized AI workers.
- An installable plugin ecosystem, including MCP-compatible integrations.
- GitHub and other external development integrations.
- Secure browser and desktop automation.
- Engineering, programming, research, and educational capabilities.
- Cross-device identity, memory, and synchronization.
- Optional future self-hosted storage and home-lab infrastructure.

# 2. Personality, Interaction, and Quality

Ann-E should be intelligent, analytical, professional, conversational, context-aware, proactive without being intrusive, and honest about uncertainty and limitations.

She must distinguish verified results from assumptions, recommendations, and incomplete work. She must not claim an operation succeeded unless the result was verified.

The interface should be polished, responsive, accessible, customizable, and consistent across supported operating systems. Voice, text, and visual interaction should complement one another.

# 3. Desktop Application

The desktop application is Ann-E's primary command center.

Target capabilities:
- Conversation interface and searchable history.
- Project and task management.
- Voice interaction.
- Plugin catalog and manager.
- Colony visualization and agent status.
- Memory management.
- Connected-device management.
- AI provider configuration.
- Security and permission controls.
- Diagnostics, logs, and settings.

# 4. Voice System

Support speech-to-text, text-to-speech, configurable voices, interruptible responses, natural turn-taking, optional wake-word detection, and spoken notifications. Voice providers must be replaceable without redesigning the core runtime.

# 5. Multi-Model AI Architecture

Initial providers:
- OpenAI.
- Google Gemini.

Future providers may include local and other commercial or open-source models.

Required capabilities:
- Independent provider configuration and authentication.
- Model selection and routing.
- Fallback and health checks.
- Usage and cost monitoring.
- Independent agent sessions.
- Shared task context and structured communication.
- Safe handling of provider errors and rate limits.

Ann-E owns the orchestration layer. The ChatGPT application and Gemini application are not assumed to communicate directly. Ann-E must communicate with each provider using authorized APIs and coordinate responses through her own backend.

# 6. Dual-AI Collaboration

OpenAI and Gemini should be able to analyze tasks independently and concurrently.

For significant development tasks:
1. Ann-E creates a precise task specification and acceptance criteria.
2. OpenAI independently analyzes the task.
3. Gemini independently analyzes the same task.
4. Each reviews relevant source code and requirements.
5. Findings and proposed changes are recorded independently.
6. Ann-E compares results and identifies disagreements.
7. Disagreements are investigated rather than silently averaged away.
8. Changes are implemented in isolated branches or worktrees.
9. Automated tests and security checks are run.
10. A human reviews sensitive or privileged operations.
11. The verified result and evidence are documented.

Use this process for architecture review, debugging, code review, test generation, security analysis, and documentation review. AI agreement is not proof of correctness.

# 7. Ann-E Plugin Ecosystem

This is a core architectural requirement. Ann-E must have her own installable plugin and connection system. Plugins extend Ann-E's capabilities without requiring core-runtime changes.

## Plugin manager capabilities

- Discover and browse integrations.
- Install, register, update, disable, reconnect, and uninstall plugins.
- Authenticate external accounts.
- Configure and review permissions.
- Discover available tools.
- Check plugin and server health.
- Inspect plugin activity and errors.
- Make approved tools available to authorized Colony workers.

## MCP compatibility

Implement an MCP-compatible client architecture supporting appropriate local and remote MCP servers.

The plugin lifecycle should cover source and compatibility checks, installation or registration, authentication, tool discovery, permission assignment, health monitoring, updates, and removal.

Plugin execution must be isolated and constrained. A plugin must not automatically receive unrestricted filesystem, terminal, desktop, credential, or network access.

## Initial integrations

- GitHub.
- Browser automation.
- Development tools.
- AI providers.
- Figma and design tools.
- Research and documentation services.
- File and storage services.
- Additional third-party MCP integrations as needed.

## Multiple GitHub connections

Support multiple GitHub accounts, organizations, and repositories independently, including:
- Personal GitHub repositories.
- Ann-E repository.
- Future ECC GitHub access, when authorized.
- Other organizations and projects.

Use GitHub App or OAuth authorization with narrow scopes. Distinguish read-only access from write, workflow, and administrative actions.

# 8. GitHub as the Canonical Project Source of Truth

**Canonical repository URL:** https://github.com/SnackSushi-code/Ann-E  
**Repository identifier:** `SnackSushi-code/Ann-E`  
**Default branch observed:** `main`

All durable Ann-E project work must be documented in this repository. This includes product requirements, architecture decisions, implementation plans, feature status, setup instructions, testing procedures, security findings, troubleshooting, release notes, and operational procedures.

Chat discussions, AI responses, and local notes may be used during development, but decisions and outcomes that matter to the project must be transferred into version-controlled documentation.

Both ChatGPT and Gemini must be instructed to:
- Use this exact repository as the canonical project location.
- Inspect the current branch and files before proposing or making changes.
- Read the README and relevant architecture/specification documents first.
- Treat repository content and current tests as the evidence of implemented functionality.
- Never assume a feature exists merely because it appears in the roadmap.
- Record proposals separately from implemented functionality.
- Use branches or isolated worktrees for code changes.
- Never overwrite another agent's work.
- Document changes, tests, limitations, and decisions.
- Include real commit SHA, branch, and pull-request references when available; never use placeholder SHAs.
- Preserve existing working behavior unless an approved task requires changing it.

Recommended documentation layout (introduce incrementally after inspecting existing files):

```text
Ann-E/
├── README.md
├── MASTER_PLAN.md
├── AI_COLLABORATION.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── development/
│   ├── features/
│   ├── security/
│   ├── testing/
│   ├── operations/
│   └── user-guides/
├── src/
├── tests/
└── .github/
    └── workflows/
```

This is a proposed target layout, not an assertion that these directories currently exist. Inspect before creating or moving files.

# 9. Ann-E Colony System

The Colony is a visual representation of real specialized agents and tasks. It should resemble a miniature settlement with specialized buildings, workers, and a central command center.

Potential buildings:
- Command Center.
- Security Hut.
- Engineering Hut.
- Development Hut.
- Research Hut.
- Learning Hut.
- Memory Archive.
- Communications Hut.
- Simulation Lab.
- Plugin Workshop.

Workers receive tasks, execute work, communicate, report progress, request clarification, surface errors, and submit results for review.

## Raised-hand behavior

A worker visibly raises its hand when it needs clarification, detects a security issue, requires permission, encounters a blocking error, disagrees with another agent, or needs human approval.

Selecting the worker should show its assignment, actual execution status, completed work, findings, evidence, recommendations, and outstanding question.

The Colony must reflect real backend activity. It must never fabricate workers, task progress, or completed operations.

# 10. Persistent Memory

Memory should be organized into:
- Conversation memory.
- Long-term memory.
- Project memory.
- Task memory.
- Knowledge/document memory.
- Device-specific memory and configuration.

Requirements:
- Natural-language and semantic retrieval.
- Conversation continuation.
- Project-specific history.
- Summarization and indexing.
- Duplicate detection.
- User correction and deletion controls.
- Appropriate retention and privacy policies.
- Attachment and document references.

Ann-E should retrieve relevant history rather than repeatedly asking the user to restate previous work.

# 11. Universal Multi-Device Synchronization

Ann-E must operate as one persistent assistant across authorized machines, initially including the Windows 11 gaming desktop and future Linux workstation, with additional Windows, Linux, and mobile clients later.

Requirements:
- Shared conversation, project, task, and long-term memory.
- Per-device authentication and revocation.
- Encrypted synchronization.
- Local caching.
- Offline queues where practical.
- Conflict detection and resolution.
- Separation of globally shared data from machine-specific settings.

Begin with a local memory service and documented API. The architecture must not require a NAS to be usable.

# 12. Optional Future Central Infrastructure

A DIY NAS or dedicated server is a future enhancement, not a current prerequisite. Initial development should use local storage and a local database with secure APIs and separate backups.

Future centralized infrastructure may host shared storage, backups, attachments, database services, and synchronization. The system must support migration without rewriting the application. A NAS must not be treated as a substitute for a separate backup.

# 13. Screen Awareness and Desktop Automation

Ann-E should eventually understand and interact with authorized desktop environments through a dedicated local desktop agent.

Target capabilities:
- Approved screen capture and screenshot analysis.
- Window and UI element recognition.
- Controlled mouse and keyboard actions.
- Application navigation.
- Development environment inspection.
- Error reproduction and UI verification.

Modes:
- **Observation:** capture and analyze approved screen content.
- **Guided:** recommend actions and wait for confirmation.
- **Controlled automation:** execute bounded, approved interactions.
- **Development:** inspect IDEs and terminals, reproduce errors, and verify changes.

Security requirements:
- Explicit permission and visible capture status.
- User pause/stop control.
- Application allowlists and sensitive-window exclusions.
- Least privilege.
- No unrestricted administrative access.
- Human approval for destructive, privileged, or sensitive actions.

ChatGPT Computer Use, when available in the user's ChatGPT environment, is a separate development-assistance capability. It does not automatically become Ann-E's own screen-awareness implementation. Ann-E must implement and secure her own local desktop agent.

# 14. Playwright and Browser Automation

Playwright should handle browser-specific workflows:
- Navigation and interaction.
- Screenshots.
- DOM and accessibility inspection.
- Form interaction.
- Web-application testing.
- Regression testing.
- Browser debugging.

Playwright is not a full general-purpose desktop screen-sharing bridge. General desktop interaction requires the separate local desktop agent.

# 15. Programming and Engineering Capabilities

Ann-E should read and understand codebases, generate and modify code, explain implementations, debug errors, run tests, review architecture, identify technical debt, and generate documentation.

Engineering domains include embedded systems, microcontrollers, circuit analysis, digital logic, electronics, engineering mathematics, simulation, hardware research, and troubleshooting.

Relevant environments may include STM32CubeIDE, ARM tools, Renode, Python, C/C++, Java, MATLAB, and Linux toolchains.

Preserve existing behavior unless a task explicitly requires a change. All modifications must be incremental and verifiable.

# 16. Research, Learning, and Productivity

Support technical research, source comparison, citations, study planning, flashcards, practice exams, project organization, and learning progress. Clearly distinguish verified information from uncertain conclusions.

# 17. Security and Privacy

Security is an architectural requirement.

Required controls:
- Authentication and authorization.
- Encrypted communication.
- Secret management.
- Least-privilege agent and plugin permissions.
- Plugin isolation.
- Audit logging.
- Input validation.
- Dependency and vulnerability scanning.
- Secure updates.
- Data retention controls.

Never expose API keys, tokens, passwords, or private credentials in model prompts or ordinary logs. Do not give agents unrestricted terminal, filesystem, desktop, or administrator access.

# 18. Dual-AI Red-Team Program

OpenAI and Gemini should independently inspect Ann-E in authorized, isolated environments using synthetic data and test credentials.

Test authentication, authorization, injection, unsafe tool execution, plugin security, data leakage, memory synchronization, desktop/browser automation, dependencies, and agent coordination.

Each finding must include severity, evidence, affected component, reproduction steps, recommended remediation, and verification results. Destructive testing and privileged modifications require human approval. Every patch must be retested.

# 19. Core Software Architecture

Proposed logical components:
1. Core Runtime.
2. AI Orchestrator.
3. Model Provider Manager.
4. Agent Manager.
5. Colony Manager.
6. Plugin Manager.
7. MCP Client.
8. Authentication and Permission Manager.
9. Memory Manager.
10. Synchronization Service.
11. Database and Storage Layer.
12. Desktop Automation Agent.
13. Browser Automation Service.
14. Voice Service.
15. Security Manager.
16. User Interface.
17. Logging and Diagnostics.

Finalize technology choices and repository structure only after inspecting the current code. Do not rewrite working systems merely to fit a proposed diagram.

# 20. GitHub Development Workflow

GitHub is the primary source-control and durable documentation platform.

Use:
- Version-controlled source.
- Feature branches.
- Pull requests.
- Issues and milestones.
- Automated tests.
- Security scans.
- Release management.
- Documentation.

AI agents should use isolated branches or worktrees and must not overwrite each other's changes.

Significant changes must include a task specification, acceptance criteria, source references, implementation, independent review, tests, security checks, required approval, and documentation.

# 21. Mandatory Development Protocol

For every significant task:
1. Inspect the current repository and relevant history.
2. Understand existing functionality.
3. Identify affected components.
4. Define acceptance criteria.
5. Create a task specification.
6. Assign independent reviewers.
7. Implement in an isolated workspace.
8. Run automated tests.
9. Perform security checks.
10. Compare findings and resolve disagreements.
11. Obtain required human approval.
12. Verify final behavior.
13. Update documentation and changelog.
14. Commit and reference the real commit.
15. Update the feature status.

Never equate generated code with working code.

# 22. Development Roadmap

## Phase 1 — Repository inspection and baseline
Inspect the actual source tree, README, current runtime, dependencies, tests, configuration, and Git history. Record implemented, partial, planned, and broken capabilities. Establish a reproducible baseline. Do not restructure before understanding the current code.

## Phase 2 — Core runtime and AI orchestration
Stabilize runtime; provider abstractions; OpenAI and Gemini integration; independent agent sessions; structured task messaging; routing; error handling.

## Phase 3 — Security foundation
Authentication, authorization, secret management, permission system, isolated execution, logging, and security tests.

## Phase 4 — Plugin ecosystem
Plugin registry, MCP client, installer, authentication, tool discovery, permission controls, lifecycle management, and initial GitHub connections.

## Phase 5 — Persistent memory
Conversation, long-term, project, and task memory; retrieval; semantic search; memory management.

## Phase 6 — Cross-device architecture
Memory API, device registration/authentication, synchronization, local cache, offline handling, conflict resolution, Windows and Linux clients.

## Phase 7 — Colony backend
Agent lifecycle, task assignment, messaging, worker state, raised-hand requests, and approval workflow.

## Phase 8 — Colony interface
Environment, specialized huts, workers, live status, task visualization, interaction, and activity history.

## Phase 9 — Screen awareness and desktop automation
Local desktop agent, secure capture, screenshot analysis, application recognition, controlled UI interaction, and permissions.

## Phase 10 — Browser automation
Playwright, browser control, DOM and accessibility inspection, screenshots, UI automation, and regression tests.

## Phase 11 — Voice and user experience
Speech recognition, text-to-speech, voice controls, notifications, accessibility, and interface refinement.

## Phase 12 — Advanced engineering and expansion
Engineering integrations, additional providers and plugins, local inference, simulations, mobile clients, and optional central infrastructure/NAS.

## Phase 13 — Reliability and release
End-to-end, cross-device, plugin-security, memory-recovery, agent-coordination, and performance testing; documentation and release preparation.

# 23. Final Expectations

Ann-E should become one persistent intelligent assistant across multiple machines. She should install integrations, connect authorized services, coordinate independent AI agents, remember prior conversations, continue projects across devices, understand approved screen content, interact with authorized applications, perform engineering and programming work, and represent real activity through the Colony.

The plugin ecosystem must be extensible. Memory must be portable. The Colony must reflect actual agents. Screen awareness must be secure. AI collaboration must be independently testable. All meaningful project work must be documented in the canonical GitHub repository.

**Ann-E must be built to grow without losing existing functionality, project history, or her identity.**
