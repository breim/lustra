const {
  installSkill,
  detectInstalledProviders,
  providers,
} = require("./install-skill");

if (process.env.CI || process.env.LUSTRA_SKIP_POSTINSTALL) {
  process.exit(0);
}

if (process.env.npm_config_global !== "true") {
  console.log(
    "lustra: local install — skill not written to your home dirs.\n" +
      "  Run `lustra install`, or install globally with `npm i -g lustra`."
  );
  process.exit(0);
}

try {
  let selected = detectInstalledProviders();
  if (!selected.length) {
    selected = providers.filter((p) => p.provider === "claude-code");
  }
  const written = installSkill(selected);
  console.log(
    `lustra: installed skill for ${selected
      .map((p) => p.displayName)
      .join(", ")}`
  );
  for (const dest of written) console.log(`  ${dest}`);
  console.log(
    "  Change targets anytime: `lustra install --all` or " +
      "`lustra install --client claude-code,cursor`"
  );
} catch (err) {
  console.warn(`lustra: skipped global skill install (${err.message})`);
}

process.exit(0);
