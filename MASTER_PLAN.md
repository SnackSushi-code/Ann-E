# Ann-E Master Plan

## 1. Project Vision

Ann-E is a personal engineering AI assistant intended to combine multi-model reasoning, specialized agents, persistent context, extensible integrations, and permissioned computer interaction in one modular platform.

The long-term objective is to help carry technical work from research and planning through implementation, testing, review, and maintenance. Ann-E should remain understandable, reliable, secure, extensible, and under the user's control.

This plan describes intended capabilities and a development direction. It is not evidence that a feature has been implemented. Implementation status must be established from the repository and actual test evidence.

## 2. Core Product Principles

- **User control:** The user remains in control of permissions, approvals, credentials, and consequential actions.
- **Truthful status:** Ann-E and its agents must distinguish planned, running, blocked, failed, completed, and verified work. Never simulate activity or claim success without evidence.
- **Modularity:** Providers, tools, agents, memory, interfaces, and integrations should be replaceable or extendable without destabilizing unrelated components.
- **Traceability:** Decisions, code changes, failures, fixes, and test outcomes must be traceable to repository history.
- **Security by design:** Apply least privilege, explicit authorization, scoped credentials, auditability, and safe defaults.
- **Incremental development:** Inspect and understand existing code before changing it. Preserve working behavior and validate changes at each step.

## 3. Personality and Interaction

Ann-E should communicate clearly, professionally, and naturally. It should be capable of concise answers and detailed technical explanations as appropriate. It should explain uncertainty, identify assumptions, ask focused questions when required, and avoid presenting guesses as facts.

The assistant should support conversational interaction while making task progress, approvals, errors, and agent activity visible.

## 4. Desktop Application

Develop a desktop experience that provides access to the assistant, active tasks, integrations, settings, and the Colony. The application should be responsive, stable, and designed for practical daily use.

The desktop interface should not imply that Ann-E has access to local resources unless the relevant local service or permissioned bridge is connected and active.

## 5. Voice

Plan for natural voice input and output, including interruption and turn-taking where supported. Voice services should be modular so providers can be changed. Microphone and audio permissions must be explicit and visible.

## 6. Multi-Model AI Architecture

Support multiple model providers, initially targeting OpenAI and Google Gemini. Provider adapters should isolate vendor-specific APIs from the core runtime.

The architecture should account for:
- Provider configuration and credential handling.
- Model selection by task and capability.
- Timeouts, retries, rate limits, and provider failures.
- Structured tool calls and validated outputs.
- Usage, cost, and diagnostic tracking where available.
- Graceful behavior when a provider is unavailable.

A provider must not be described as connected until its credentials, permissions, and a real request have been verified.

## 7. Independent AI Collaboration

ChatGPT, Gemini, and other authorized AI contributors should be able to review work independently, identify defects, challenge assumptions, and recommend improvements.

Collaboration should use the same canonical repository and clear task boundaries. Contributors should avoid conflicting edits by using separate branches or worktrees and coordinating through issues and pull requests. Review findings must be recorded, and proposed fixes must be validated before acceptance.

## 8. Plugin and Integration Ecosystem

Build an extensible integration system through which Ann-E can discover, install, configure, authorize, update, disable, and remove plugins.

The system should support integrations such as GitHub and compatible MCP servers, with clear metadata, versioning, permissions, configuration, and lifecycle management. Installing a plugin must not silently grant broad access. Each integration should request only the scopes it needs, and the user should be able to inspect and revoke access.

Support multiple authorized accounts and repositories where appropriate, without mixing identities, credentials, or access scopes.

## 9. GitHub as the Engineering Source of Truth

The Ann-E repository is the canonical source for project code, decisions, issues, reviews, and development history.

- Inspect the current repository state before beginning work.
- Use issues to capture bugs, questions, risks, and proposed improvements.
- Use branches for isolated work and pull requests for reviewable changes.
- Keep commits focused and write meaningful commit messages.
- Include actual test commands and results; never invent test evidence.
- Keep implementation status accurate and distinguish planned, partial, implemented, and verified capabilities.

### Mandatory Phase Completion and GitHub Documentation Requirement

**Whenever a development phase is completed and its code is pushed to GitHub, the push must be accompanied by a phase-completion record documenting the engineering work.** This is a required deliverable for every phase, not an optional summary and not merely a list of files changed.

The phase-completion documentation must follow this structure:

1. **Purpose and scope:** Explain why the phase was undertaken, what it covered, and what was intentionally out of scope.
2. **Investigation and implementation:** Record what was inspected, what was learned, the design or implementation approach, and what was changed.
3. **Bugs, failures, and unexpected findings:** Record issues encountered during development, including relevant symptoms, logs, or reproduction details where useful.
4. **Root causes and fixes:** Explain the root causes established through investigation and the fixes applied. If a root cause remains unknown, state that explicitly.
5. **Testing and actual results:** List the tests, checks, or manual verification performed, the environment and commands where relevant, and the actual outcomes. Clearly identify tests that were not run or that failed.
6. **Remaining limitations, risks, and follow-up work:** Document known gaps, technical debt, unresolved risks, and the next actions required.

The record must make it possible for another contributor to understand not only what changed, but why it changed, what was discovered, what went wrong, how it was addressed, and how the result was verified.

**GitHub delivery rule:** A phase is not considered fully documented or complete merely because its code has been pushed. The corresponding phase record must be committed and pushed to the repository as part of the same phase delivery. The pull request should link to or contain this record and summarize the test evidence. If the phase is delivered directly without a pull request, the documentation must still be included in the relevant commit or commits.

Use a consistent location and naming convention for phase records once the repository structure is established (for example, a `docs/phases/` directory with one Markdown report per phase). Do not create a report before the work has occurred and fill it with assumptions. Complete it from actual development evidence at phase closeout.

## 10. The Colony: Visual Agent Environment

Create a visual environment that represents specialized agents as workers with identifiable roles and real task states. The Colony should be an operational view of the agent system, not decorative animation.

Workers should visibly communicate meaningful states such as idle, working, waiting, blocked, failed, completed, or requiring approval. A worker raising a hand should represent a real event—for example, a blocker, uncertainty, a detected issue, a request for human approval, or a need for assistance. The interface should expose enough context for the user to understand and respond.

Agent status must be driven by runtime events and task state, not fabricated activity.

## 11. Agent Architecture and Orchestration

Support specialized agents with defined responsibilities, tool access, and boundaries. An orchestrator should delegate work, track dependencies, collect results, handle failures, and request human intervention when needed.

Agents should not receive unrestricted access by default. Tool permissions should be scoped to the agent and task.

## 12. Persistent Memory

Develop memory that can preserve useful conversation context, project knowledge, decisions, preferences, and task history across sessions.

Memory should be inspectable and manageable, with appropriate controls for correction and deletion. Sensitive information and credentials must not be stored as ordinary conversational memory. Retrieval should be relevant, permission-aware, and explainable where practical.

## 13. Multi-Device Continuity

Enable authorized devices to access shared conversation and project context. A task started on one computer should be resumable on another when synchronization is available.

The design should address identity, authentication, encryption in transit and at rest, synchronization conflicts, offline behavior, and device revocation.

A dedicated NAS or home server is an optional future hosting choice, not a prerequisite for initial software development. Begin with a practical architecture that can later support centralized self-hosted services.

## 14. Screen Awareness and Desktop Automation

Plan a permissioned local desktop bridge for screen capture and interaction with authorized applications. The bridge should have explicit user controls, visible activity, and scoped permissions.

Screen access, keyboard/mouse control, file access, and administrative operations must be treated as separate permissions. Destructive or consequential actions require confirmation. The system should provide an emergency stop and auditable action history.

Do not assume that browser automation provides full desktop control. A browser automation tool and a local desktop agent solve different problems.

## 15. Browser Automation

Use browser automation, such as Playwright where appropriate, for authorized web workflows. Support controlled navigation, interaction, extraction, and verification.

Browser sessions should use isolated contexts where possible. Credentials, downloads, submissions, purchases, and other consequential actions require suitable safeguards and user approval.

## 16. Engineering and Development Capabilities

The intended assistant should help with:
- Software development, debugging, code review, and testing.
- Computer and electrical engineering workflows.
- Embedded systems and microcontroller development.
- Technical research and documentation.
- Project planning, requirements, and systems engineering.
- Git and GitHub workflows.

Recommendations and generated code should be checked against the target environment and available evidence. Ann-E should not claim that code builds, tests pass, hardware works, or changes were deployed unless those outcomes have actually been verified.

## 17. Research, Learning, and Productivity

Support technical research, source comparison, study assistance, task planning, and knowledge organization. Distinguish sourced facts from inference and uncertainty. Preserve source references when research informs project decisions.

## 18. Security, Privacy, and Permission Model

Security is a core architectural requirement, not a later add-on.

- Apply least privilege to tools, agents, plugins, and devices.
- Store secrets using an appropriate secret-management mechanism; never commit API keys or tokens.
- Separate user identity, provider credentials, plugin credentials, and agent permissions.
- Validate tool inputs and outputs.
- Use allowlists and scoped workspaces for file and command operations.
- Require approval for destructive, external, financial, administrative, or otherwise consequential actions.
- Maintain useful audit logs without unnecessarily recording sensitive data.
- Provide revocation, shutdown, and recovery mechanisms.
- Test security controls using authorized, isolated environments and synthetic credentials/data.

No model should receive unrestricted terminal, filesystem, credential, desktop, or administrator access simply because it is part of the system.

## 19. Dual-AI Review and Security Testing

Establish a review process in which independent AI contributors can inspect architecture and code, identify vulnerabilities, and propose fixes. Security testing must be limited to systems and environments the user is authorized to test.

Findings should include severity, impact, reproduction evidence, affected components, and recommended remediation. Fixes should be reviewed and tested. Do not treat an AI review as a substitute for actual tests or qualified security assessment where required.

## 20. Reliability and Observability

Build structured logging, diagnostics, error handling, health checks, and clear runtime status. Make failures actionable and avoid silently swallowing errors. Track task and agent state transitions so the Colony and user interface reflect actual runtime behavior.

## 21. Core Software Architecture

The implementation should be modular, testable, and documented as it becomes established. Candidate boundaries include:
- Core application/runtime.
- Model-provider adapters.
- Agent orchestration and task state.
- Tool and plugin registry.
- Permission and approval services.
- Memory and retrieval.
- Synchronization and device identity.
- Desktop and browser bridges.
- User interface and Colony visualization.
- Logging, diagnostics, and testing.

These are architectural areas to evaluate, not a claim that corresponding modules already exist. Choose frameworks and technologies after inspecting the current repository and recording the rationale.

## 22. Development Roadmap

The roadmap is provisional and must be refined after inspecting the actual codebase.

1. **Repository and baseline assessment:** Inventory the code, configuration, dependencies, tests, workflows, and current behavior. Establish what exists and what runs.
2. **Core runtime foundation:** Define application boundaries, configuration, logging, error handling, and a minimal working runtime.
3. **Provider integration:** Implement and verify provider adapters and model selection.
4. **Tool permissions and security foundation:** Establish permission checks, secret handling, approvals, and auditability before expanding tool access.
5. **Plugin architecture:** Design and test plugin discovery, installation, configuration, authorization, lifecycle, and revocation.
6. **Agent orchestration:** Implement task delegation, agent roles, state tracking, and failure handling.
7. **Persistent memory:** Add storage, retrieval, user controls, and tests.
8. **Multi-device continuity:** Design and implement authenticated synchronization.
9. **Colony interface:** Connect the visual environment to real agent and task states.
10. **Browser and desktop bridges:** Add separately permissioned browser automation and local desktop interaction.
11. **Voice interface:** Add voice input/output and interaction controls.
12. **Advanced integrations and engineering workflows:** Expand capabilities based on tested user needs.
13. **Hardening and release readiness:** Perform regression, security, reliability, usability, and packaging checks.

Phases may be split, reordered, or combined when repository evidence supports doing so. Any change to the roadmap should be explained and recorded.

## 23. Required Development Protocol

For every task:

1. Inspect the relevant repository files, history, tests, and existing behavior before editing.
2. State the problem, intended outcome, scope, and acceptance criteria.
3. Identify risks, dependencies, and permission requirements.
4. Make the smallest coherent change that solves the problem.
5. Add or update tests where appropriate.
6. Run relevant checks and report exact results honestly.
7. Review the diff for regressions, security concerns, and unrelated changes.
8. Record decisions and meaningful findings in the appropriate GitHub issue, pull request, or phase report.
9. Commit and push only the intended changes, following the project's agreed branch and review workflow.
10. At phase completion, satisfy the mandatory phase documentation and GitHub delivery rule in Section 9.

Do not claim a task or phase is complete when acceptance criteria remain unmet, verification has not occurred, or required documentation has not been committed.

## 24. Definition of Done

A feature or phase is complete only when:
- Its scope and acceptance criteria are satisfied.
- The implementation is integrated cleanly with existing behavior.
- Relevant tests and checks have been run, with actual results recorded.
- Known failures, limitations, and risks are disclosed.
- Changes have been reviewed for correctness and security.
- Required GitHub issues, pull request details, commits, and phase-completion documentation are present.
- The implementation status is accurately represented.

---

This master plan is a living engineering plan. Update it when material architectural decisions, priorities, or project constraints change, and preserve the reasoning behind those changes in GitHub history.
