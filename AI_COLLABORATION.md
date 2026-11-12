# Ann-E AI Collaboration and Repository Rules

**Canonical repository:** https://github.com/SnackSushi-code/Ann-E  
**Repository slug:** `SnackSushi-code/Ann-E`  
**Default branch observed when this document was created:** `main`  
**Canonical specification:** [MASTER_PLAN.md](./MASTER_PLAN.md)

These instructions apply to every AI assistant, coding agent, reviewer, and human contributor working on Ann-E.

## 1. Source of truth

This GitHub repository is the canonical source of truth for Ann-E's code and durable project documentation.

Before working:
1. Open the repository URL above.
2. Inspect the current default branch and working tree.
3. Read `README.md`, `MASTER_PLAN.md`, and this file.
4. Inspect relevant source code, tests, configuration, issues, and recent commits.
5. Determine what is implemented, partially implemented, planned, or broken.

Do not assume the roadmap describes existing functionality. Verify every implementation claim against code and tests.

## 2. Documentation requirement

Everything important and durable about Ann-E must be documented in this repository, including:
- Product requirements and architecture.
- Architecture decisions and tradeoffs.
- Setup and installation instructions.
- Feature specifications and implementation status.
- API and plugin contracts.
- AI provider configuration.
- Security model and threat assessments.
- Test plans, results, and known limitations.
- Debugging and troubleshooting records.
- Release notes and migration instructions.
- Operational procedures.

Keep documentation close to the relevant code where practical. Update README, changelog, feature status, or architecture documents whenever a change makes them stale.

Conversations outside GitHub are not the durable project record. Transfer approved decisions and verified outcomes into version-controlled documentation.

## 3. Multi-agent collaboration

OpenAI and Gemini must review important tasks independently before comparing results.

Each task should carry:
- Unique task identifier.
- Goal and context.
- Acceptance criteria.
- Repository, branch, and base commit.
- Relevant files.
- Assigned agent and role.
- Proposed changes.
- Test commands and results.
- Security considerations.
- Approval requirements.
- Final commit and pull-request references.

Agents must not overwrite each other's work. Use separate branches or worktrees. One integration owner should reconcile changes after independent reviews.

## 4. Change safety

- Do not perform broad rewrites without an approved plan.
- Preserve existing working behavior.
- Prefer small, reviewable changes.
- Never commit secrets, API keys, tokens, passwords, or private user data.
- Do not bypass tests to force a green result.
- Do not claim tests passed unless actually run and results recorded.
- Do not invent commit SHAs, branch names, test evidence, or feature status.
- Do not merge or deploy sensitive changes without required human approval.
- Use authorized, isolated environments for security testing.

## 5. Required change record

Every meaningful implementation should document:
1. Problem and rationale.
2. Scope and acceptance criteria.
3. Design and files changed.
4. Tests executed and actual results.
5. Security and privacy review.
6. Known limitations and follow-up work.
7. Real commit SHA and pull-request link, once available.

## 6. Feature status vocabulary

Use consistent statuses:
- **Planned:** requirement exists; no implementation verified.
- **In progress:** implementation underway.
- **Implemented:** code exists, but acceptance testing may be incomplete.
- **Verified:** acceptance criteria pass with recorded evidence.
- **Blocked:** work cannot proceed; blocker documented.
- **Deprecated:** replaced or intentionally retired.

## 7. Repository access

Repository URL: https://github.com/SnackSushi-code/Ann-E

AI assistants must use their own authorized GitHub connection or a user-authorized local checkout. A URL in a prompt does not itself grant access. Never share personal access tokens in chat or repository files.

## 8. Definition of done

A task is complete only when:
- Acceptance criteria are met.
- Relevant automated tests have been run.
- Security impact has been considered.
- Documentation and feature status are updated.
- Changes are committed to an appropriate branch.
- Review and approval requirements are satisfied.
- The actual commit and PR references are recorded.

When verification is impossible, clearly mark the work as implemented but unverified, and explain the limitation.
