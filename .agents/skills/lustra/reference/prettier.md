# prettier

**Purpose:** formatting drift, fixed mechanically, with nothing else touched.

## Detect

1. `npx -y prettier --check` over the target. Honor any existing `.prettierrc` and
   `.prettierignore`; do not create or modify them.
2. If the project has no Prettier config, run with defaults and say the result reflects
   Prettier defaults, not a project standard; offer to add a config as a separate
   confirmed step.

## Triage

There is nothing to triage — Prettier output is deterministic. Just separate files it can
reformat from files it cannot parse (report parse failures as real errors to fix at the
source, not format).

## Fix policy

- Auto: `prettier --write` on the drifted files. This is the canonical mechanically-safe
  fix (rule 2). Re-run `--check` to confirm clean.
- Never hand-edit formatting or "tidy" code Prettier did not flag.

## Report

Count of files reformatted, list of unparseable files with their errors.
