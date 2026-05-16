---
name: lustra
description: "Use when the user wants to clean up AI slop, harden a codebase, or run technical due diligence: review code for security flaws and vulnerable or wrongly-licensed dependencies, find and remove dead code, audit dependency health, run and triage linters, type checkers, test suites and Prettier, find performance smells, check documentation and CI health, scaffold baseline configs for the detected stack, do a structured code review, fix project structure, or produce one aggregated health report across all of these. Triggers on phrases like clean this up, find security issues, remove dead code, check dependencies, lint, typecheck, run the tests, format, review my code, check licenses, is this slow, fix the project structure, set up the project, audit everything, due diligence, or this looks like AI slop. Wraps real tools (npm audit, knip, eslint, tsc, the test runner, prettier, npm outdated, license-checker) and triages their output. Not for UI/visual design work."
user-invocable: true
argument-hint: "[audit|security|license|libs|types|tests|deadcode|lint|review|perf|structure|docs|ci|prettier|baseline] [target]"
allowed-tools: Bash Read Edit Grep Glob
---

# Lustra

Lustra wraps real code-hygiene tooling and applies judgment on top of it. It does not
guess where a tool would. It runs the tool, filters false positives, ranks what matters,
and fixes only what is safe to fix automatically.

## Dispatch

`$1` is the command. `$2` and beyond are the target (a path or glob). When no target is
given, default to the whole repository.

- If `$1` is empty or `help`, print the command list below and stop.
- Otherwise read `${CLAUDE_SKILL_DIR}/reference/$1.md` and follow it exactly, scoped to the
  target. If `reference/$1.md` does not exist, say so and print the command list.

## Commands

Grouped by lifecycle phase. `audit` runs the diagnostic ones together.

**Assess / start**
- `audit` — meta-command: one graded health report across every dimension (due diligence).
- `baseline` — scaffold the guardrail configs a project should have, for the detected stack.

**Iterate**
- `review` — structured correctness / design / slop review of a diff or path.
- `types` — type-checker triage; catch `any`/`@ts-ignore` evasion.
- `tests` — run the suite, coverage on the diff, catch fake/empty tests.
- `lint` — ESLint plus AI-slop smells that no rule catches.
- `prettier` — formatting drift.

**Polish**
- `security` — vulnerabilities: secrets, injection, broken authorization, vulnerable deps.
- `license` — dependency license compatibility and IP risk.
- `deadcode` — unused files, exports, and dependencies (knip).
- `libs` — dependency health: outdated, deprecated, duplicated, unused.
- `perf` — performance smells: N+1, blocking IO, unbounded growth, bundle weight.
- `docs` — documentation drift and undocumented public surface.

**Maintain**
- `ci` — pipeline soundness: real gates, CI security, reproducibility.
- `structure` — detect the stack, then report or reorganize project structure.

## Rules that override every reference file

These come from the project's own engineering guidelines and are not negotiable:

1. **Surgical.** Every changed line must trace to the requested command. Never "improve"
   adjacent code, comments, or formatting that the command did not target.
2. **No silent scope changes.** Deleting code, moving files, or removing a dependency is a
   scope decision. Auto-apply only mechanically-safe fixes (formatting, an unambiguously
   unused import). For anything semantic, show the diff and ask first.
3. **Report honestly.** If a tool is missing, a step was skipped, or a finding is
   low-confidence, say so plainly. Do not present a partial pass as a clean one.
4. **English only**, in all output and any code or config you write.
5. **Confirm before destructive or hard-to-reverse actions.** A staged plan with explicit
   confirmation, never a bulk rewrite.
