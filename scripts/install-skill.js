const fs = require('fs')
const os = require('os')
const path = require('path')
const providers = require('./providers')

const source = path.join(__dirname, '..', 'skill')

function destFor(configDir) {
  return path.join(os.homedir(), configDir, 'skills', 'lustra')
}

function detectInstalledProviders() {
  return providers.filter(p =>
    fs.existsSync(path.join(os.homedir(), p.configDir))
  )
}

function resolveProviders(names) {
  return names.map(name => {
    const p = providers.find(x => x.provider === name)
    if (!p) {
      const known = providers.map(x => x.provider).join(', ')
      throw new Error(`unknown client "${name}" (known: ${known})`)
    }
    return p
  })
}

function installSkill(selected) {
  const list = selected && selected.length ? selected : providers
  const written = []
  for (const p of list) {
    const dest = destFor(p.configDir)
    fs.rmSync(dest, { recursive: true, force: true })
    fs.mkdirSync(dest, { recursive: true })
    fs.cpSync(source, dest, { recursive: true })
    written.push(dest)
  }
  return written
}

module.exports = {
  providers,
  detectInstalledProviders,
  resolveProviders,
  installSkill
}
