#!/usr/bin/env node
const path = require("path");
const { execFileSync } = require("child_process");
const { installSkill, targets } = require("../scripts/install-skill");

const command = process.argv[2] || "help";

if (command === "install") {
  const written = installSkill();
  console.log("lustra: skill installed to");
  for (const dest of written) console.log(`  ${dest}`);
} else if (command === "build") {
  execFileSync("node", [path.join(__dirname, "..", "scripts", "build.js")], {
    stdio: "inherit",
  });
} else {
  console.log(`lustra — code-hygiene skill for AI coding agents

Usage:
  lustra help       Show this message
  lustra install    (Re)install the skill into your home agent dirs
  lustra build      Regenerate the per-harness skill directories

Skill commands (inside your agent):
  /lustra audit       One graded health report (due diligence)
  /lustra baseline    Scaffold guardrail configs for the stack
  /lustra review      Structured review of a diff or path
  /lustra types       Type-checker triage, catch evasion
  /lustra tests       Run suite, diff coverage, catch fake tests
  /lustra lint        ESLint + AI-slop smells
  /lustra prettier    Fix formatting drift
  /lustra security    Find exploitable security defects
  /lustra license     Dependency license / IP risk
  /lustra deadcode    Remove unused files, exports, dependencies
  /lustra libs        Audit dependency health
  /lustra perf        Performance smells
  /lustra docs        Documentation drift and gaps
  /lustra ci          Pipeline soundness
  /lustra structure   Detect the stack, advise or reorganize

Skill install targets:
  ${targets.join("\n  ")}`);
}
