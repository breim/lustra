# ci

**Purpose:** the pipeline that guards the project is itself sound.

## Detect

1. Locate CI config: `.github/workflows/*`, `.gitlab-ci.yml`, `Jenkinsfile`,
   `.circleci/`, etc. If a real project has none, that is the top finding.
2. Check the pipeline actually gates: are lint, types, tests, build, and audit run, and
   do they **fail** the job (not `|| true`, not `continue-on-error` masking failures)?
3. Security/hygiene: secrets echoed into logs, untrusted PR code running with secrets,
   unpinned third-party actions (`@main`), missing least-privilege `permissions`,
   no dependency/lockfile install integrity (`npm ci` vs `npm install`).
4. Reproducibility: pinned toolchain versions, cache keyed correctly, deterministic
   install from the lockfile.

## Triage

Rank: a gate that doesn't gate (green pipeline, broken check) > security exposure in CI >
non-reproducible build > missing-but-non-critical step. The most dangerous finding is a
pipeline that *looks* green while enforcing nothing — call it out first.

## Fix policy

- Auto: nothing — CI changes affect every future build.
- Propose (diff + ask): the specific workflow edit (add the failing gate, pin the action,
  scope `permissions`, switch to `npm ci`), one concern per change, with the risk it closes.

## Report

Pipeline inventory, gate analysis (what is enforced vs. claimed), security/reproducibility
findings — each with the proposed config change.
