# perf

**Purpose:** find code that is correct but wasteful — the slop that works and is slow.

## Detect

Static reading of the target (no synthetic benchmarking unless the user asks):

- N+1 queries / calls in a loop, awaits serialized inside a loop that could batch.
- Synchronous or blocking IO on a hot/request path.
- Unbounded growth: loading a whole collection to use one item, missing pagination,
  caches with no eviction, recursion without a bound.
- Repeated work: recomputation that could be hoisted/memoized, redundant re-renders
  (framework-specific), O(n²) where O(n) is trivial.
- Bundle weight (front-end target): a heavy dependency used for one helper, a missing
  dynamic import on a large rarely-used path. Use `npx -y source-map-explorer` /
  bundler stats only if a build output exists.

## Triage

Rank by `frequency of the path × cost of the waste`. A slow startup script is not a slow
request handler. Skip micro-optimizations with no measurable impact — say so rather than
listing them. Flag only what you can name concretely (the loop, the query, the import).

## Fix policy

- Auto: nothing — perf changes alter behavior risk.
- Propose (diff + ask): the specific transform (batch, hoist, paginate, lazy-load), with
  the reason it is faster and any correctness caveat. One change per finding.

## Report

Findings ranked by impact: `file:line` — the waste — the hot path it sits on — proposed fix.
