const fs = require("fs");
const os = require("os");
const path = require("path");

const source = path.join(__dirname, "..", "skill");
const targets = [
  path.join(os.homedir(), ".claude", "skills", "lustra"),
  path.join(os.homedir(), ".agents", "skills", "lustra"),
];

function installSkill() {
  const written = [];
  for (const dest of targets) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(source, dest, { recursive: true });
    written.push(dest);
  }
  return written;
}

module.exports = { installSkill, targets };
