# license

**Purpose:** the legal/IP leg of due diligence — does the dependency tree put the
project's own license at risk.

## Detect

1. Read the project's declared license from the manifest. If absent, that is itself a
   top finding.
2. Enumerate dependency licenses: `npx -y license-checker --json` (or the pnpm/yarn
   equivalent), including transitive. For non-JS stacks use the stack's tool
   (`pip-licenses`, `go-licenses`, `cargo about`) if present; otherwise read manifests
   and state the result is partial.
3. Flag: copyleft (GPL/AGPL/LGPL) reaching a proprietary or permissively-licensed
   project, packages with **no** license or `UNLICENSED`, custom/unrecognized licenses,
   and missing attribution for licenses that require it (BSD/MIT/Apache NOTICE).

## Triage

Rank by legal exposure: AGPL/GPL contamination of a distributed proprietary product is
**blocking**; LGPL via dynamic linking is conditional; missing attribution is fixable;
permissive-on-permissive is clear. Distinguish runtime deps (contaminating) from
dev-only deps (generally not). Never give a legal conclusion — surface the risk and
recommend counsel for blocking cases.

## Fix policy

- Auto: nothing. License changes are decisions, not edits.
- Propose (diff + ask): replacing a problematic package with a compatibly-licensed
  equivalent, or adding the required attribution/NOTICE file.

## Report

Project license, the dependency-license matrix grouped by risk tier, blocking items
called out first, and explicit "needs legal review" flags. State coverage gaps.
