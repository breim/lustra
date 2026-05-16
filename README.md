# Lustra

A code-hygiene skill for AI coding agents. Where design skills make AI *prettier*, Lustra
makes AI code *clean*: it wraps real tooling (`npm audit`, `knip`, `eslint`, `prettier`,
`npm outdated`) run inside your agent, then triages, prioritizes, and fixes the output —
with judgment, not guesses.

## Commands

Invoke as a single skill with a sub-command and an optional target. Commands map to a
project lifecycle — **start → iterate → polish → maintain** — and `audit` runs the
diagnostic ones together for a one-shot health report / technical due diligence.

| Phase | Command | What it does |
| --- | --- | --- |
| start | `/lustra audit`     | One graded health report across every dimension (due diligence) |
| start | `/lustra baseline`  | Scaffold the guardrail configs for the detected stack |
| iterate | `/lustra review`  | Structured correctness / design / slop review of a diff or path |
| iterate | `/lustra types`   | Type-checker triage; catch `any`/`@ts-ignore` evasion |
| iterate | `/lustra tests`   | Run the suite, coverage on the diff, catch fake/empty tests |
| iterate | `/lustra lint`    | ESLint plus AI-slop smells no rule catches |
| iterate | `/lustra prettier`| Formatting drift, fixed mechanically |
| polish | `/lustra security` | Exploitable security defects: secrets, injection, authz, vulnerable deps |
| polish | `/lustra license`  | Dependency license compatibility and IP risk |
| polish | `/lustra deadcode` | Unused files, exports, dependencies (knip), confirmed before deletion |
| polish | `/lustra libs`     | Dependency health: outdated, deprecated, duplicated, unused |
| polish | `/lustra perf`     | Performance smells: N+1, blocking IO, unbounded growth, bundle weight |
| polish | `/lustra docs`     | Documentation drift and undocumented public surface |
| maintain | `/lustra ci`     | Pipeline soundness: real gates, CI security, reproducibility |
| maintain | `/lustra structure` | Detect the stack, then advise or reorganize project structure |

Target defaults to the whole repo: `/lustra security src/api`.

## Install

Via the skills CLI (installs into your agent's skill directory):

```sh
npx skills add breim/lustra
```

Via npm (the `postinstall` drops the skill into `~/.claude/skills/lustra/` and
`~/.agents/skills/lustra/`):

```sh
npm i -g lustra
lustra help
```

`lustra install` reinstalls the skill; `lustra build` regenerates the per-harness dirs.

> The installed `~/.claude/skills/lustra/` and `~/.agents/skills/lustra/` are a **managed
> mirror**: every global install and every `lustra install` replaces them wholesale. Do
> not hand-edit them — change `skill/` and rebuild.

## For contributors

`skill/` is the **single source of truth** — `skill/SKILL.md` (the router) and
`skill/reference/*.md` (one file per command).

`npm run build` compiles `skill/` into the committed per-harness directories
(`.claude/`, `.agents/`, `.cursor/`, `.gemini/`, `.github/`) via `scripts/providers.js`.
Edit `skill/`, never the generated dirs, then rebuild and commit the result.

### Publishing

1. Push to a **public** GitHub repo `breim/lustra`.
2. `npm run build` and commit the generated provider directories.
3. `npm publish --access public`.
4. skills.sh discovery is automatic once people install via the skills CLI.
