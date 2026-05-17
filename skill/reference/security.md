# security

**Purpose:** find real, exploitable security defects, not theoretical lint noise.

## Detect

Run, scoped to the target:

1. `npm audit --json` (or `pnpm audit --json` / `yarn npm audit --json` based on the
   lockfile present). Skip with a note if there is no manifest.
2. Secret sweep with Grep over the target: private keys (`BEGIN .* PRIVATE KEY`),
   AWS keys (`AKIA[0-9A-Z]{16}`), generic high-entropy assignments to names containing
   `secret|token|password|apikey`, and `.env` files committed alongside code.
3. If `semgrep` is on PATH, `semgrep --config auto --json`. Do not install it.
4. Read the source in the target for: unparameterized SQL/shell built by string
   concatenation, `eval`/`new Function`/`child_process` on untrusted input, missing
   authorization checks on mutation handlers, unsafe deserialization, and disabled TLS
   verification.

## Triage

Rank each finding by `severity × confidence × blast radius`. Drop tool findings that are
test fixtures, examples, or unreachable. Separate "confirmed" from "needs human judgment".
A transitive advisory with no exploit path is noted, not raised to critical.

## Fix policy

- Present each vulnerable-dependency bump as a checklist item (package, version delta,
  advisory, breaking? y/n). Apply only the approved bumps.
- Propose (diff + ask): code changes for injection/authz/deserialization, any major
  version bump, removing a committed secret (also state it must be rotated, not just
  deleted).

## Report

Grouped by severity. Each: `file:line` — finding — exploit path — recommended action.
End with what was skipped and why.
