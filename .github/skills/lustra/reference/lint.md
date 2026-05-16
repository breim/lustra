# lint

**Purpose:** the linter's findings, plus the slop a linter structurally cannot see.

## Detect

1. If an ESLint config exists, `npx -y eslint . --format json` scoped to the target.
2. If none exists, do **not** silently add one. Run with a minimal recommended config and
   say the result is advisory; offer to add a real config as a separate, confirmed step.
3. Read the target for AI-slop smells no rule catches:
   - Abstractions with exactly one caller; indirection that only forwards.
   - `try/catch` that logs and rethrows, swallows, or re-wraps with no added meaning.
   - Comments that restate the code, section-header comments, `added for X` notes,
     leftover TODOs.
   - Defensive checks for conditions the type system or call sites make impossible.
   - Dead config keys and options wired to nothing.

## Triage

ESLint errors before warnings. For slop smells, only raise ones you can justify concretely
— name the caller count, the impossible condition, the comment that adds nothing. Skip
stylistic preferences the repo's own config does not enforce.

## Fix policy

- Auto: `eslint --fix` for the autofixable set, then re-run to confirm zero regressions.
- Propose (diff + ask): every slop-smell change — these are semantic. Match existing
  style; do not reformat untouched lines.

## Report

Two sections: ESLint (counts + remaining manual items) and slop smells (`file:line`,
the smell, the concrete justification, the proposed change).
