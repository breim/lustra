const { installSkill } = require("./install-skill");

if (process.env.CI || process.env.LUSTRA_SKIP_POSTINSTALL) {
  process.exit(0);
}

try {
  const written = installSkill();
  console.log("lustra: skill installed to");
  for (const dest of written) console.log(`  ${dest}`);
} catch (err) {
  console.warn(`lustra: skipped global skill install (${err.message})`);
}

process.exit(0);
