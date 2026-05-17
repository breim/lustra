# Lustra

The code-hygiene skill that makes your AI harness clean up its own slop. 1 skill,
18 commands wrapping real tooling, from first commit to technical due diligence.

> Install with `npx skills add breim/lustra`, or `npm i -g lustra-cli` for a global skill.

## Why Lustra?

AI writes code that runs and looks fine and is quietly wrong: dead abstractions, fake
error handling, tests that assert nothing, dependencies nobody uses, a green pipeline that
gates nothing. Linters catch a slice of it. The rest needs judgment on top of real tools.

Lustra detects your stack and runs its actual tooling — the dependency auditor, linter,
type checker, test runner, formatter, dead-code and license scanners — then triages the
output: filters false positives, ranks by real risk, fixes only what is mechanically
safe, and proposes the rest as a diff. It does not guess where a tool would. It runs the
tool and applies judgment.

## What's Included

18 commands under one skill, mapped to a project lifecycle. `audit` runs the diagnostic
ones together for a one-shot health report.

| Phase | Command | What it does |
| --- | --- | --- |
| start | `audit`     | One graded health report across every dimension (due diligence) |
| start | `baseline`  | Scaffold the guardrail configs for the detected stack |
| iterate | `review`  | Structured correctness / design / slop review of a diff or path |
| iterate | `types`   | Type-checker triage; catch `any`/`@ts-ignore`-style evasion |
| iterate | `tests`   | Run the suite, coverage on the diff, catch fake/empty tests |
| iterate | `analyze` | The linter's findings plus AI-slop smells no rule catches |
| iterate | `format`  | Formatting drift, fixed mechanically |
| polish | `security` | Exploitable defects: secrets, injection, authz, vulnerable deps |
| polish | `license`  | Dependency license compatibility and IP risk |
| polish | `deadcode` | Unused files, exports, dependencies — confirmed before deletion |
| polish | `deps`     | Dependency health and upgrades: outdated, deprecated, duplicated |
| polish | `design`   | Module/package design: SOLID, or cohesion/coupling for non-OO stacks |
| polish | `observability` | Logging and instrumentation quality so failures are diagnosable |
| polish | `perf`     | Performance smells: N+1, blocking IO, unbounded growth, bundle weight |
| polish | `docs`     | Documentation drift and undocumented public surface |
| maintain | `migrate` | Guided one-major-at-a-time dependency migration with codemods |
| maintain | `ci`     | Pipeline soundness: real gates, CI security, reproducibility |
| maintain | `structure` | Detect the stack, then advise or reorganize project structure |

Every command obeys the same rules: surgical changes only, no silent scope cuts,
auto-fix only what is mechanically safe, English-only output, confirm before anything
hard to reverse.

## The Flow

Lustra is built around how a codebase actually moves: **start → iterate → polish →
maintain.**

- **Start** — `audit` an inherited codebase to see what you really have; `baseline` a
  fresh one so it has guardrails from day one.
- **Iterate** — while building, `review` the diff, then `types`, `tests`, `analyze`,
  `format` to keep the loop honest.
- **Polish** — before shipping, harden it: `security`, `license`, `deadcode`, `deps`,
  `design`, `observability`, `perf`, `docs`.
- **Maintain** — over time, `migrate`, `ci` and `structure` keep the project from rotting.

For technical due diligence, `audit` is the answer: it runs security, license, supply
chain, reliability, maintainability and bus-factor checks and grades each — without
changing a line.

## Installation

Via the skills CLI — installs into your agent's skill directory:

```sh
npx skills add breim/lustra
```

Via npm — a global install auto-detects which clients you already use (any of
`~/.claude`, `~/.cursor`, `~/.gemini`, `~/.codex`, `~/.github`, `~/.kiro`,
`~/.opencode`, `~/.qoder`, `~/.agents`) and installs the skill for those:

```sh
npm i -g lustra-cli
lustra help
```

Pick clients explicitly at any time:

```sh
lustra install                       # auto-detect, or prompt when run in a terminal
lustra install --all                 # every supported client
lustra install --client claude-code,cursor
```

Supported clients: Claude Code, Cursor, Gemini CLI, Codex CLI, VS Code Copilot,
Kiro, OpenCode, Qoder, plus the generic `agents` standard.

> The installed skill dirs are a **managed mirror**: every install replaces them
> wholesale. Do not hand-edit them — change `skill/` and rebuild. A non-global
> `npm install` does **not** touch your home directories.

## Usage

Invoke the skill with a command and an optional target. No target means the whole repo.

```
/lustra audit
/lustra security src/api
/lustra deadcode
/lustra review
```

`/lustra` with no command prints the command list.

## CLI

```sh
lustra help                        # commands and supported clients
lustra install                     # install: auto-detect, or prompt in a terminal
lustra install --all               # install for every supported client
lustra install --client a,b        # install for specific clients
lustra build                       # regenerate the per-harness skill directories
```

## Supported Tools

Lustra detects the stack first, then orchestrates the tools you already use for it and
stays out of the way when one is absent (it says so rather than guessing): the
dependency-vulnerability scanner (`npm audit`/`pip-audit`/`govulncheck`/`cargo audit`),
linter (ESLint/Ruff/`go vet`/Clippy), type checker (`tsc`/mypy/`go vet`/`cargo check`),
test runner (jest/vitest/pytest/`go test`/`cargo test`), formatter
(Prettier/Black/`gofmt`/`rustfmt`), dead-code and license scanners, and `semgrep` when
present. Each command's reference file carries its own per-ecosystem tool table; an
unknown stack falls back to static reading, flagged as lower-confidence.

## Contributing

`skill/` is the **single source of truth** and the only skill content tracked in git —
`skill/SKILL.md` (the router) and `skill/reference/*.md` (one file per command). Edit
`skill/`, nothing else. `npm run build` compiles it into the per-harness directories
(`.claude/`, `.agents/`, `.cursor/`, `.gemini/`, `.github/`, …) via
`scripts/providers.js`; those dirs are gitignored — local artifacts for dogfooding this
repo and for the smoke suite (`npm test` runs `build` itself).

Publishing: push to the public `breim/lustra` repo, bump the version, and
`npm publish --access public` (`prepublishOnly` runs `build`). The npm `files` whitelist
ships only `skill/` — the generated per-harness dirs are never published. At install time
`scripts/install-skill.js` copies `skill/` into the user's selected clients; skills.sh
discovery is automatic via the skills CLI.

## License

MIT. See [LICENSE](LICENSE).
