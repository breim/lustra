# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
