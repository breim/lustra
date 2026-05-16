# deadcode

**Purpose:** remove code that nothing reaches, with proof, not guesses.

## Detect

1. `npx -y knip --reporter json`, scoped to the target if knip supports the workspace.
   If a `knip.json` exists, use it; do not overwrite it.
2. If knip cannot run (no Node project / unsupported stack), fall back to: build the
   import graph for the target with Grep/Glob and flag exported symbols and files with
   zero inbound references. State clearly this fallback is lower confidence.

## Triage

knip over-reports across these categories — review each before acting:

- **Unused files / exports:** confirm there is no dynamic import, string-keyed require,
  framework convention (route/page files), or barrel re-export reaching them.
- **Unused dependencies:** confirm they are not used only in scripts, config, or types.
- Entry points, public API surfaces, and intentionally-exported library code are *not*
  dead code even with zero internal callers — exclude them.

## Fix policy

Deleting code is a scope decision (rule 2). Never bulk-delete. Present the confirmed-dead
set as a checklist with the evidence for each item, then delete only what the user
approves, in one reviewable change. Remove imports your deletions orphan; nothing else.

## Report

Three groups: confirmed dead (with evidence), likely dead (needs human call), excluded
(why it looked dead but isn't).
