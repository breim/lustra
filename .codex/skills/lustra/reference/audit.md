# audit

**Purpose:** the meta-command. One aggregated health report across every Lustra
dimension — the answer to "I inherited this code, what's here?" and to "is everything in
order?" (technical due diligence).

## Run

Execute the other commands in **diagnostic mode only — detect and triage, do not fix
anything**, in this order, and collect their findings:

1. **Legal / risk:** `security`, `license`
2. **Supply chain:** `libs`
3. **Reliability:** `types`, `tests`
4. **Maintainability:** `deadcode`, `lint`, `review`, `perf`
5. **Bus factor / ops:** `structure`, `docs`, `ci`

Each runs over the whole target. Skip a dimension only if its tooling/stack is absent,
and record the skip explicitly — a gap is a due-diligence finding, not a blank.

`baseline` is **not** part of audit (it is generative, not diagnostic). If `baseline`
would have lots to do, note "no project guardrails" under maintainability instead.

## Triage

Per dimension, assign a grade — **pass / concerns / fail** — with the one or two findings
that drove it. Surface every **blocking** item (exploitable security, copyleft
contamination, a green-but-fake test suite, a pipeline that gates nothing) at the top,
above the per-dimension detail. Do not average a fail away into a "B".

## Fix policy

Audit **never edits**. It ends by offering to drill into any single dimension with that
command (which then applies its own fix policy). One report, zero changes.

## Report

```
Lustra audit — <target>

Blocking
  - <dimension>: <finding>

Scorecard
  Legal/risk        pass|concerns|fail   <driver>
  Supply chain      ...
  Reliability       ...
  Maintainability   ...
  Bus factor/ops    ...

Detail
  <per-dimension findings, each: file:line — finding — recommended command>

Skipped
  <dimension> — <why>
```

End with the recommended next command(s), highest-risk first.
