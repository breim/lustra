# review

**Purpose:** a focused human-grade review of a change, not a tool dump.

## Scope

If the target is a path, review that path. Otherwise review the working diff
(`git diff` against the merge base, or staged/unstaged if not a branch). If there is no
diff and no path, ask what to review.

## Detect

Use the other commands' tools as inputs where they help: run `eslint`, `npm audit`, and
`knip` over the changed files and fold real findings in. Then read the change for what
tools miss:

- Correctness: off-by-one, error paths, async/await misuse, missed `null`/empty cases.
- Edge cases the change introduces or fails to handle.
- Design: wrong abstraction level, leaky boundaries, state that should not be shared.
- Slop: invented APIs, plausible-but-wrong library usage, over-engineering, fake
  robustness (see `lint.md` smells).

## Triage

Three buckets: **blocking** (correctness/security), **should-fix** (design/maintainability),
**optional** (preference — mark as such, keep few). Cite `file:line` and explain *why* it
is wrong, not just that it differs from taste.

## Fix policy

Review proposes; it does not auto-edit. Offer to apply blocking fixes as a separate,
confirmed step after the user has read the review.

## Report

The three buckets, ordered, each item: `file:line` — issue — why — suggested fix.
