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

- Present the drifted files as an itemized checklist (rule 2). On approval, run
  `prettier --write` on the approved subset only, then re-run `--check` to confirm clean.
- Never hand-edit formatting or "tidy" code Prettier did not flag.

## Report

Count of files reformatted, list of unparseable files with their errors.
