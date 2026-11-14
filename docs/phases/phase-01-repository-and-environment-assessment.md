# Phase 01 — Repository and Environment Assessment

## 1. Phase Purpose and Scope
Establish a verified baseline of the `SnackSushi-code/Ann-E` public repository and the host development workstation prior to application architecture design (Phase 2). Audit and remediate historical exposure of private planning documents (`MASTER_PLAN.md`, `AI_COLLABORATION.md`) in the target local checkout (`C:\Users\nickf\projects\Ann-E`) and public GitHub branch refs, and implement initial path-based secret-leakage prevention controls (`.gitignore`).

## 2. Learning Objectives
- Understand how Git tracks working directories, branches, remote-tracking references (`origin/*`), and commit histories (`git status`, `git log --all`, `git branch -r`, `git show`).
- Understand the difference between *ignored* files, *untracked (not ignored)* files, and *tracked* files in Git.
- Understand the security boundaries of `.gitignore`: it only prevents accidental staging of untracked file paths; it cannot protect secrets placed inside already-tracked files, nor can it prevent forced staging via `git add -f`.
- Understand why deleting a file in a subsequent commit (`74dd47b`) does not erase the file from earlier commits (`b1a6ccc`, `e467bc5`, `0b32cfc`), and why secondary remote branches (`codex/*`) keep historical commits reachable in Git's object graph until deleted.
- Understand how to establish a clean single-commit root history (`git checkout --orphan`) and garbage-collect unreachable Git objects locally (`git reflog expire --expire=now --all` and `git gc --prune=now --aggressive`).
- Understand how `git check-ignore --quiet` tests whether a path is excluded (`exit 0`) or allowed (`exit 1`), including when negation rules (`!/.env.example`) are present.

## 3. Initial Investigation
### Repository Baseline (`SnackSushi-code/Ann-E`)
- **Active Branch at Start:** `main` (at `74dd47b`)
- **Tracked Files in Working Tree at Start:** `README.md` (2,191 bytes)
- **Historical Commit & Remote Branch Audit (Pre-Purge):**
  - `74dd47b` (`origin/main`) — Deleted `MASTER_PLAN.md`
  - `b1a6ccc` — Added `MASTER_PLAN.md` (244 lines of private engineering charter)
  - `ca8d5ee` (`origin/codex/gemini-provider-windows-ci`) — Previous prototype branch referencing `b1a6ccc`
  - `ea2ab3f` (`origin/codex/windows-desktop-foundation`) — Previous prototype branch referencing `b1a6ccc`
  - `0b32cfc` & `e467bc5` — Earlier commits adding `AI_COLLABORATION.md` and `MASTER_PLAN.md`
- **Repository Baseline After Purge (Target Checkout & Public Branch Refs):**
  - **Root Commit on `main` and `origin/main`:** `c9aef15` (`Initial commit: Ann-E project vision README`)
  - **Local Git Objects in `C:\Users\nickf\projects\Ann-E`:** `3` (1 commit, 1 tree, 1 blob for `README.md`)
  - **Active Feature Branch:** `phase-01-assessment` (branched from `c9aef15`)
  - **Untracked (Not Ignored) Working Tree Files:** `.gitignore` and `docs/phases/phase-01-repository-and-environment-assessment.md`

### Host Workstation Baseline
- **Operating System:** Microsoft Windows NT 10.0.26300.0 (Windows 11)
- **Linux Subsystem (WSL):** Installed; Default Distribution: `Ubuntu`
- **Git Version:** `git version 2.55.0.windows.3`
- **Python Installations (via `py --list`):**
  - Python `3.14.7` (64-bit, default)
  - Python `3.12` (64-bit)
  - Python `3.11` (64-bit)
- **Pip Version:** `pip 26.2.2` (Python 3.14)
- **Node.js Version:** `v22.23.1`
- **IDE:** Visual Studio Code

## 4. Architecture and Design Decisions
- **Selected Core Stack (for Phase 2+):**
  - **Backend / Core Brain:** Python (3.12 / 3.14) with FastAPI and Pydantic for strict schema validation and modular AI/agent orchestration.
  - **Frontend / The Colony (Future Phase):** TypeScript + React.
  - **Local Persistence (Future Phase):** SQLite for local development, isolated via `.gitignore`.
- **Cross-Platform OS Compatibility Testing:** The presence of both Windows 11 and WSL (Ubuntu) on the host workstation enables local Windows and Linux compatibility testing on a single machine. Note: This does not replace true multi-device testing across separate physical hosts/environments (Phase 10).

## 5. Implementation Details
1. Cloned `https://github.com/SnackSushi-code/Ann-E.git` into `C:\Users\nickf\projects\Ann-E`.
2. Audited commit history (`git log --all --oneline --stat`) and remote branches (`git branch -r`), identifying that `MASTER_PLAN.md` and `AI_COLLABORATION.md` were retained in history across `main` and two `codex/*` remote branches (`135` total Git objects in the local clone).
3. Created an orphan branch (`clean-main`) containing solely `README.md` as root commit `c9aef15`, replaced `main`, and force-pushed `main` to `origin`.
4. Deleted remote branches `codex/gemini-provider-windows-ci` and `codex/windows-desktop-foundation` from GitHub, pruned `origin`, expired reflogs, and ran `git gc --prune=now --aggressive`, reducing the local object store in `C:\Users\nickf\projects\Ann-E` from `135` objects to `3` objects.
5. Created feature branch `phase-01-assessment` from `c9aef15`.
6. Created and iteratively hardened root `.gitignore` to block:
   - Environment files (`.env`, `.env.*`, `*.env`, `*.env.*`, `.envrc*`), allowing only root `!/.env.example`.
   - Keys, certificates, and cloud/SSH credential directories (`.ssh/`, `.aws/`, `.gcp/`, `.azure/`, `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`, etc.).
   - Secret, credential, API key, token, and password files across configuration formats (`*.secret*`, `*.token*`, `*.password*`, `*secret*`, `*token*`, and `*password*` across `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.cfg`, `.conf`, `.properties`, `.xml`, `.txt`, plus `*credential*`, `*api-key*`, `*apikey*`, `*api_key*`).
   - SQLite databases and all WAL/SHM/Journal sidecar files (`*.db*`, `*.sqlite*`, `*.sqlite3*`, including `db.sqlite3-wal`, `db.sqlite3-shm`, `db.sqlite3-journal`).
   - Editor configuration directories (`.vscode/`, `.idea/`) without exceptions so debug/task files (`launch.json`, `tasks.json`, `settings.json`) containing environment secrets cannot be committed.
7. Created `docs/phases/phase-01-repository-and-environment-assessment.md`.

## 6. Bugs and Failures Encountered
- **Issue 1 (PowerShell Escape Character):** Initial attempt to print newlines in PowerShell used `'n` (single quote) and misspelled `-ForgroundColor`.
- **Issue 2 (Working Directory Context):** Initial `git status` and `git log` commands were executed in `C:\Users\nickf\projects` rather than `C:\Users\nickf\projects\Ann-E`, resulting in `fatal: not a git repository`.
- **Issue 3 (`.gitignore` Negation Rule & `git check-ignore -v` Exit Code):** In the first draft of `.gitignore`, using overly broad `*secret*` combined with `!docs/**` caused `git check-ignore -v` to return exit code `0` on `docs/phases/...`.
- **Issue 4 (Incomplete History Purge Due to Remote Branch References):** Resetting `main` to `876032d` (and subsequently force-pushing orphan commit `c9aef15` to `main`) did not allow `git gc` to purge `b1a6ccc` until remote branches `origin/codex/gemini-provider-windows-ci` and `origin/codex/windows-desktop-foundation` were deleted and pruned.
- **Issue 5 (`.gitignore` Edge Cases Caught in Independent Review — Round 1):** Independent review by ChatGPT identified that the initial `.gitignore` did not exclude `prod.env`, `.envrc`, `.ssh/id_ed25519`, `.aws/credentials`, `secrets.toml`, `credentials.ini`, `api-key.txt`, SQLite sidecars (`db.sqlite3-wal`, `db.sqlite3-shm`, `db.sqlite3-journal`), and permitted `.vscode/settings.json`, `tasks.json`, and `launch.json` as well as nested `.env.example` files.
- **Issue 6 (`.gitignore` Format Parity Gaps Caught in Independent Review — Round 2):** In a 37-case matrix test, ChatGPT identified 2 failures: `token.conf` (missing `.conf`/`.cfg` on `*token*`) and `secret.properties` (missing `.properties` across secret/token rules).
- **Issue 7 (`*password*.xml` Rule Omission Caught in Independent Review — Round 3):** In a 50-case matrix test, ChatGPT identified that while the report claimed `*password*` covered `.xml`, `.gitignore` had `*secret*.xml` and `*token*.xml` but omitted `*password*.xml` (causing `password.xml` to fail).

## 7. Root Cause Analysis
- **Issue 1:** PowerShell requires the backtick character (`` `n ``) inside double-quoted strings and exact parameter spelling (`-ForegroundColor`).
- **Issue 2:** The terminal working directory had not stepped into the cloned `Ann-E` subdirectory prior to invoking Git CLI commands.
- **Issue 3:** `git check-ignore -v` exits `0` whenever *any* rule—including a `!` negation rule—matches a path; `git check-ignore --quiet <path>` must be used to test actual exclusion status via exit code.
- **Issue 4:** Git garbage collection only purges unreachable objects; commits reachable from `refs/remotes/origin/*` remain protected until those remote branches are deleted and pruned.
- **Issue 5, Issue 6 & Issue 7:** Manual maintenance of separate extension lists across `*secret*`, `*token*`, and `*password*` rules led to omissions (`.conf`, `.properties`, and `*password*.xml`) when the test matrix did not test every claimed format for each prefix.

## 8. Fixes and Changes
- Stepped into `C:\Users\nickf\projects\Ann-E`.
- Replaced `main` with orphan root commit `c9aef15` (`README.md` only), deleted `codex/gemini-provider-windows-ci` and `codex/windows-desktop-foundation` on `origin`, pruned `origin`, expired reflogs, and ran `git gc --prune=now --aggressive`.
- Standardized `.gitignore` secret, token, and password rules with 100% parity across `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.cfg`, `.conf`, `.properties`, `.xml`, and `.txt` (explicitly adding `*.password`, `*.passwords`, and `*password*.xml`), blocked all `.vscode/` files, and anchored `!/.env.example` to the repository root.
- Verified all 50 excluded and allowed paths (including `secret.xml`, `token.xml`, and `password.xml`) using `git check-ignore --quiet`.

## 9. Tests Performed and Actual Results
- **Environment Tooling Verification:** Executed PowerShell version checks for OS, Git, Python (`py --list`), Pip, Node.js, and WSL. **Result: PASSED.**
- **Target Checkout & Public Branch Purge Verification:** Executed `git log --all --oneline` (verified only `c9aef15` exists in `C:\Users\nickf\projects\Ann-E`), `git gc --prune=now --aggressive` (verified `Total 3` local objects), and `git show b1a6ccc` (failed with `fatal: ambiguous argument 'b1a6ccc'`). **Result: PASSED.**
- **Expanded 50-Case `.gitignore` Verification Matrix (`git check-ignore --quiet`):**
  - **45 Excluded Secret/Artifact Paths Tested (`exit 0`):** `.env`, `.env.local`, `.env.production`, `prod.env`, `config/dev.env`, `.envrc`, `.envrc.local`, `nested/.env.example`, `api_key.pem`, `server.key`, `cert.pfx`, `.ssh/id_ed25519`, `.ssh/id_rsa`, `.aws/credentials`, `.gcp/service-account.json`, `db.secret`, `app.secrets`, `secrets.json`, `secrets.yaml`, `secrets.toml`, `secret.ini`, `secret.cfg`, `secret.conf`, `secret.properties`, `secret.xml`, `credentials.ini`, `credentials.json`, `api-key.txt`, `openai_apikey.env`, `auth_token.json`, `token.conf`, `token.properties`, `token.toml`, `token.xml`, `password.properties`, `password.xml`, `local_memory.sqlite3`, `db.sqlite3-wal`, `db.sqlite3-shm`, `db.sqlite3-journal`, `.venv/Scripts/python.exe`, `node_modules/pkg/index.js`, `.vscode/settings.json`, `.vscode/launch.json`, `.vscode/tasks.json`. *(45/45 Excluded — PASSED).*
  - **5 Allowed / Non-Ignored Paths Tested (`exit 1`):** `.env.example`, `README.md`, `.gitignore`, `docs/phases/phase-01-repository-and-environment-assessment.md`, `src/ann_e/main.py`. *(5/5 Allowed — PASSED).*
  - **Overall Matrix Result: 50/50 PASSED.**

## 10. Commands and Environment Used
- **Environment:** Windows 11 PowerShell (`PS C:\Users\nickf\projects\Ann-E>`)
- **Commands Executed:**
  - `git clone https://github.com/SnackSushi-code/Ann-E.git`
  - `Set-Location "C:\Users\nickf\projects\Ann-E"`
  - `git log --all --oneline --stat`
  - `git checkout --orphan clean-main`
  - `git add README.md && git commit -m "Initial commit: Ann-E project vision README"`
  - `git push origin main --force`
  - `git push origin --delete codex/gemini-provider-windows-ci`
  - `git push origin --delete codex/windows-desktop-foundation`
  - `git remote prune origin`
  - `git reflog expire --expire=now --all`
  - `git gc --prune=now --aggressive`
  - `git show b1a6ccc`
  - `git checkout -b phase-01-assessment`
  - `git check-ignore --quiet <path>` (50-case automated verification matrix)
  - `git status -uall`

## 11. Tests Not Performed
- Application unit, integration, API, UI, and runtime performance tests were **Not Tested** in Phase 1 because no application source code exists yet (scheduled for Phase 2+).
- GitHub repository settings (such as branch protection rules) were **Not Verified** in Phase 1.

## 12. Security Considerations
- **Finding 01 (Historical Exposure of Private Planning Docs — Remediated in Target Checkout & Public Refs):** Commits `b1a6ccc`, `e467bc5`, and `0b32cfc` exposed `MASTER_PLAN.md` and `AI_COLLABORATION.md` across `main` and two `codex/*` branches.
  - **Remediation & Scope:** Rewrote `main` as single-commit orphan branch (`c9aef15`), deleted the two `codex/*` remote branches on `origin`, and pruned local object storage in `C:\Users\nickf\projects\Ann-E` down to `3` objects (`README.md` only).
- **Mitigation 01 (Hardened `.gitignore` & Its Boundaries):** Excluded environment files, SSH/cloud key paths, multi-format secret/credential/API-key/token/password files (including `.conf`, `.properties`, and `.xml`), SQLite WAL/SHM/Journal sidecars, and `.vscode/` configuration files prior to Phase 2 package installation. Note: `.gitignore` only prevents accidental staging of untracked files matching these path patterns; it cannot block secrets hardcoded inside tracked source files or override `git add -f`.

## 13. Lessons Learned
- Always inspect `git log --all` and `git branch -r` when auditing a repository for sensitive history; secondary branches keep historical commits alive even if `main` is rewritten.
- Use `git check-ignore --quiet <path>` in automated tests to accurately distinguish ignored paths (`exit 0`) from non-ignored paths and `!` exceptions (`exit 1`).
- Keep extension lists 100% symmetric across `*secret*`, `*token*`, and `*password*` patterns (`.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.cfg`, `.conf`, `.properties`, `.xml`, `.txt`) and verify every claimed extension in the automated test matrix.

## 14. Remaining Limitations
- **Inherent Limits of `.gitignore`:** `.gitignore` only filters untracked paths. It cannot detect secrets pasted inside tracked source files, un-track an already-tracked file, or block `git add -f`. Automated pre-commit content scanning (`pre-commit` / `detect-secrets`) is still pending and scheduled for Phase 2.
- **Other Local Clones on Disk:** Purging `C:\Users\nickf\projects\Ann-E` and updating `origin` on GitHub does not automatically alter separate local clones/checkouts stored elsewhere (such as an existing checkout in the Codex workspace, which retains `MASTER_PLAN.md` and old `codex/*` branches in its local `.git` history until re-cloned or pruned).
- **GitHub Server-Side Object Cache:** While `origin` branch refs now point solely to `c9aef15`, GitHub's backend object store may retain unreferenced commits in cache until server-side garbage collection runs or support purges them.
- **Branch Protection:** GitHub branch protection rules are **Not Verified**.

## 15. Follow-Up Work (Phase 2 — Architecture and Foundation)
- Sync or re-clone any secondary local checkouts (e.g., Codex workspace checkout) so they match `origin/main` (`c9aef15`).
- Initialize isolated Python virtual environment (`.venv`).
- Set up `pyproject.toml`, directory hierarchy (`src/ann_e/`, `tests/`, `docs/`), strict configuration loader (`pydantic-settings`), structured logging, error handling, pre-commit secret scanning, and `pytest` + `ruff` + security linter suite.
