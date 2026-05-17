# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-05-17

### Added

- `design` command: paradigm-aware module/package design review — SOLID for OO stacks,
  cohesion/coupling/composition for Go, Rust, and functional ones. Module-scoped, distinct
  from diff-scoped `review` and layout-scoped `structure`.
- `observability` command: logging and instrumentation quality — swallowed errors,
  secrets/PII in logs, missing error context, absent metrics on critical paths.
- `migrate` command: guided one-major-at-a-time dependency migration with changelog
  reading, codemods, and isolated verification.
- `SKILL.md` gains a shared Stack detection section; reference files point to it instead
  of assuming a Node project.
- `LUSTRA_BUILD_ROOT` override in `scripts/build.js` to direct generated provider
  directories elsewhere.

### Changed

- Renamed `lint` → `analyze`, `prettier` → `format`, `libs` → `deps` (the last with a
  sharpened scope: health and upgrades only — deletion is `deadcode`, vulnerability
  remediation is `security`, major upgrades are `migrate`).
- Decoupled the skill from the JS/npm ecosystem: every tool-running command now carries a
  per-ecosystem tool table (Node/Python/Go/Rust) with an explicit fallback, instead of
  hardcoding `eslint`/`prettier`/`npm`/`knip`. Now 18 commands.
- Normalized every reference file to the same structure (Purpose / Detect / Triage /
  Fix policy / Report) and updated `README.md`, `SKILL.md`, and the package description.

### Fixed

- Smoke tests no longer write provider directories into the repository working tree;
  builds under test target a temporary directory.

## [0.1.1] - 2026-05-17

### Changed

- `prettier`, `lint`, `security`, and `libs` no longer auto-apply fixes. Every change is
  now presented as an itemized checklist and only the approved subset is applied, matching
  the `deadcode` flow. Read-only detection still runs automatically. `SKILL.md` gains a
  shared Confirmation flow section and tighter rules 2 and 5.

## [0.1.0] - 2026-05-17

Initial release.

### Added

- 15 code-hygiene commands under a single `/lustra <command> [target]` skill:
  `audit`, `baseline`, `review`, `types`, `tests`, `lint`, `prettier`, `security`,
  `license`, `deadcode`, `libs`, `perf`, `docs`, `ci`, `structure`. Commands wrap real
  tooling (`npm audit`, `knip`, `eslint`, `tsc`, the test runner, `prettier`,
  `npm outdated`, `license-checker`, `semgrep`) and triage the output.
- `audit` meta-command producing one graded health report across every dimension for
  technical due diligence.
- Multi-harness build (`scripts/build.js`) compiling the single source in `skill/` into
  nine client directories: Claude Code, Cursor, Gemini CLI, Codex CLI, VS Code Copilot,
  Kiro, OpenCode, Qoder, and the generic `agents` standard.
- `lustra` CLI with `help`, `install`, and `build`. Global `npm i -g` auto-detects
  which client config directories exist and installs only for those; `lustra install`
  adds interactive selection plus `--all` and `--client` flags.
- Distribution via `npx skills add breim/lustra` and `npm i -g lustra`.
