# libs

**Purpose:** a clear, risk-ranked picture of dependency health and what to upgrade.

## Detect

1. `npm outdated --json` (or the pnpm/yarn equivalent for the lockfile present).
2. `npm audit --json` for advisories on those deps.
3. `npx -y knip --dependencies` for unused and unlisted dependencies.
4. Inspect the manifest for: deprecated packages (npm marks these on install), two
   packages solving the same job, and pinned-but-ancient versions.

## Triage

Group every dependency into one of:

- **Safe** — patch/minor with no breaking notes; batch these.
- **Review** — minor with behavior changes, or a transitive security bump.
- **Major** — semver-major; one at a time, needs changelog reading and a test run.
- **Remove** — unused (confirm like `deadcode` does before trusting knip).
- **Replace** — deprecated or duplicated; name the recommended successor.

## Fix policy

- Auto: the **Safe** batch, only with a lockfile, showing every version delta.
- Propose (diff + ask): **Review**, **Major**, **Remove**, **Replace** — one logical
  change per step, never a blanket bump.

## Report

The five groups above. For majors, link/quote the relevant changelog breaking changes.
End with skipped items and why.
