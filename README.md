# Lustra

The code-hygiene skill that makes your AI harness clean up its own slop. 1 skill,
15 commands wrapping real tooling, from first commit to technical due diligence.

> Install with `npx skills add breim/lustra`, or `npm i -g lustra` for a global skill.

## Why Lustra?

AI writes code that runs and looks fine and is quietly wrong: dead abstractions, fake
error handling, tests that assert nothing, dependencies nobody uses, a green pipeline that
gates nothing. Linters catch a slice of it. The rest needs judgment on top of real tools.

Lustra runs the actual tooling — `npm audit`, `knip`, `eslint`, `tsc`, your test runner,
`prettier`, `license-checker` — then triages the output: filters false positives, ranks by
real risk, fixes only what is mechanically safe, and proposes the rest as a diff. It does
not guess where a tool would. It runs the tool and applies judgment.

## What's Included

15 commands under one skill, mapped to a project lifecycle. `audit` runs the diagnostic
ones together for a one-shot health report.

| Phase | Command | What it does |
| --- | --- | --- |
| start | `audit`     | One graded health report across every dimension (due diligence) |
| start | `baseline`  | Scaffold the guardrail configs for the detected stack |
| iterate | `review`  | Structured correctness / design / slop review of a diff or path |
| iterate | `types`   | Type-checker triage; catch `any`/`@ts-ignore` evasion |
| iterate | `tests`   | Run the suite, coverage on the diff, catch fake/empty tests |
| iterate | `lint`    | ESLint plus AI-slop smells no rule catches |
| iterate | `prettier`| Formatting drift, fixed mechanically |
| polish | `security` | Exploitable defects: secrets, injection, authz, vulnerable deps |
| polish | `license`  | Dependency license compatibility and IP risk |
| polish | `deadcode` | Unused files, exports, dependencies — confirmed before deletion |
| polish | `libs`     | Dependency health: outdated, deprecated, duplicated, unused |
| polish | `perf`     | Performance smells: N+1, blocking IO, unbounded growth, bundle weight |
| polish | `docs`     | Documentation drift and undocumented public surface |
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
- **Iterate** — while building, `review` the diff, then `types`, `tests`, `lint`,
  `prettier` to keep the loop honest.
- **Polish** — before shipping, harden it: `security`, `license`, `deadcode`, `libs`,
  `perf`, `docs`.
- **Maintain** — over time, `ci` and `structure` keep the project from rotting.

For technical due diligence, `audit` is the answer: it runs security, license, supply
chain, reliability, maintainability and bus-factor checks and grades each — without
changing a line.

## Installation

Via the skills CLI — installs into your agent's skill directory:

```sh
npx skills add breim/lustra
```

Via npm — a global install drops the skill into `~/.claude/skills/lustra/` and
`~/.agents/skills/lustra/`:

```sh
npm i -g lustra
lustra help
```

> The installed skill dirs are a **managed mirror**: every global install and every
> `lustra install` replaces them wholesale. Do not hand-edit them — change `skill/` and
> rebuild. A non-global `npm install` does **not** touch your home directories.

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
lustra help       # commands and install targets
lustra install    # (re)install the skill into your home agent dirs
lustra build      # regenerate the per-harness skill directories
```

## Supported Tools

Lustra orchestrates tools you already use and stays out of the way when one is absent
(it says so rather than guessing): `npm audit`, `knip`, `eslint`, `tsc`, the project's
test runner (jest/vitest/mocha/pytest/…), `prettier`, `npm outdated`, `license-checker`,
and `semgrep` when present. Non-JS stacks are detected and handled with their own tooling
where available.

## Contributing

`skill/` is the **single source of truth** — `skill/SKILL.md` (the router) and
`skill/reference/*.md` (one file per command). `npm run build` compiles it into the
committed per-harness directories (`.claude/`, `.agents/`, `.cursor/`, `.gemini/`,
`.github/`) via `scripts/providers.js`. Edit `skill/`, never the generated dirs, then
rebuild and commit. `npm test` runs the smoke suite.

Publishing: push to the public `breim/lustra` repo, `npm run build`, commit the generated
dirs, `npm publish --access public`. skills.sh discovery is automatic via the skills CLI.

## License

MIT. See [LICENSE](LICENSE).
