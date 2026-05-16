const fs = require("fs");
const path = require("path");
const providers = require("./providers");

const root = path.join(__dirname, "..");
const source = path.join(root, "skill");

if (!fs.existsSync(path.join(source, "SKILL.md"))) {
  console.error("skill/SKILL.md not found — nothing to build");
  process.exit(1);
}

for (const { configDir, displayName } of providers) {
  const dest = path.join(root, configDir, "skills", "lustra");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(source, dest, { recursive: true });
  console.log(`${displayName.padEnd(20)} -> ${path.join(configDir, "skills", "lustra")}`);
}

console.log(`built ${providers.length} provider targets`);
