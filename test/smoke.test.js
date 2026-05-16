const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.join(__dirname, "..");
const providers = require("../scripts/providers");
const refCount = fs.readdirSync(path.join(root, "skill", "reference")).length;

test("build produces SKILL.md + every reference file for each provider", () => {
  execFileSync("node", [path.join(root, "scripts", "build.js")], { cwd: root });
  for (const { configDir } of providers) {
    const dir = path.join(root, configDir, "skills", "lustra");
    assert.ok(fs.existsSync(path.join(dir, "SKILL.md")), `${configDir} SKILL.md`);
    const refs = fs.readdirSync(path.join(dir, "reference"));
    assert.equal(refs.length, refCount, `${configDir} reference count`);
  }
});

test("postinstall installs to home only when global, and is idempotent", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "lustra-g-"));
  const env = { ...process.env, HOME: home, npm_config_global: "true" };
  delete env.CI;
  const claudeSkill = path.join(home, ".claude", "skills", "lustra", "SKILL.md");

  execFileSync("node", [path.join(root, "scripts", "postinstall.js")], { env });
  assert.ok(fs.existsSync(claudeSkill), "installed on first global run");
  const before = fs.readdirSync(path.join(home, ".claude", "skills", "lustra", "reference")).length;

  execFileSync("node", [path.join(root, "scripts", "postinstall.js")], { env });
  const after = fs.readdirSync(path.join(home, ".claude", "skills", "lustra", "reference")).length;
  assert.equal(after, before, "idempotent on second run");

  fs.rmSync(home, { recursive: true, force: true });
});

test("postinstall does not touch home on a non-global install", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "lustra-l-"));
  const env = { ...process.env, HOME: home };
  delete env.CI;
  delete env.npm_config_global;

  execFileSync("node", [path.join(root, "scripts", "postinstall.js")], { env });
  assert.ok(!fs.existsSync(path.join(home, ".claude")), "no .claude written");
  assert.ok(!fs.existsSync(path.join(home, ".agents")), "no .agents written");

  fs.rmSync(home, { recursive: true, force: true });
});
