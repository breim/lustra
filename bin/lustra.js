#!/usr/bin/env node
const path = require("path");
const readline = require("readline");
const { execFileSync } = require("child_process");
const {
  providers,
  detectInstalledProviders,
  resolveProviders,
  installSkill,
} = require("../scripts/install-skill");

const argv = process.argv.slice(2);
const command = argv[0] || "help";

function flag(name) {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
}

function report(written, selected) {
  console.log(
    `lustra: installed skill for ${selected
      .map((p) => p.displayName)
      .join(", ")}`
  );
  for (const dest of written) console.log(`  ${dest}`);
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a.trim());
    })
  );
}

async function pickInteractive() {
  const detected = detectInstalledProviders();
  console.log("Available clients:");
  providers.forEach((p, i) => {
    const mark = detected.includes(p) ? " (detected)" : "";
    console.log(`  ${i + 1}. ${p.provider} — ${p.displayName}${mark}`);
  });
  const def = detected.length
    ? detected.map((p) => p.provider).join(",")
    : "claude-code";
  const answer = await ask(
    `Install for which clients? numbers/names comma-separated, "all", ` +
      `Enter = ${def}: `
  );
  if (!answer) return resolveProviders(def.split(","));
  if (answer.toLowerCase() === "all") return providers;
  return answer.split(",").map((tok) => {
    const t = tok.trim();
    const byIndex = providers[Number(t) - 1];
    if (/^\d+$/.test(t) && byIndex) return byIndex;
    return resolveProviders([t])[0];
  });
}

async function runInstall() {
  let selected;
  if (argv.includes("--all")) {
    selected = providers;
  } else if (flag("--client")) {
    selected = resolveProviders(
      flag("--client")
        .split(",")
        .map((s) => s.trim())
    );
  } else if (process.stdin.isTTY) {
    selected = await pickInteractive();
  } else {
    const detected = detectInstalledProviders();
    selected = detected.length
      ? detected
      : resolveProviders(["claude-code"]);
  }
  report(installSkill(selected), selected);
}

if (command === "install") {
  runInstall().catch((err) => {
    console.error(`lustra: ${err.message}`);
    process.exit(1);
  });
} else if (command === "build") {
  execFileSync("node", [path.join(__dirname, "..", "scripts", "build.js")], {
    stdio: "inherit",
  });
} else {
  console.log(`lustra — code-hygiene skill for AI coding agents

Usage:
  lustra help                       Show this message
  lustra install                    Install the skill (auto-detect or prompt)
  lustra install --all              Install for every supported client
  lustra install --client a,b       Install for specific clients
  lustra build                      Regenerate the per-harness skill directories

Clients: ${providers.map((p) => p.provider).join(", ")}

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
  /lustra structure   Detect the stack, advise or reorganize`);
}
