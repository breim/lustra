const { test } = require('node:test')
const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const root = path.join(__dirname, '..')
const providers = require('../scripts/providers')
const refCount = fs.readdirSync(path.join(root, 'skill', 'reference')).length

const postinstall = path.join(root, 'scripts', 'postinstall.js')
const bin = path.join(root, 'bin', 'lustra.js')

function tmpHome(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}
function skillDir(home, configDir) {
  return path.join(home, configDir, 'skills', 'lustra')
}
function runNode(file, args, env) {
  return execFileSync('node', [file, ...args], {
    env: { ...process.env, ...env },
    encoding: 'utf8'
  })
}

test('build produces SKILL.md + every reference file for each provider', () => {
  execFileSync('node', [path.join(root, 'scripts', 'build.js')], { cwd: root })
  for (const { configDir } of providers) {
    const dir = path.join(root, configDir, 'skills', 'lustra')
    assert.ok(
      fs.existsSync(path.join(dir, 'SKILL.md')),
      `${configDir} SKILL.md`
    )
    assert.equal(
      fs.readdirSync(path.join(dir, 'reference')).length,
      refCount,
      `${configDir} reference count`
    )
  }
})

test('global postinstall with nothing detected falls back to Claude Code, idempotent', () => {
  const home = tmpHome('lustra-g-')
  const env = { HOME: home, npm_config_global: 'true', CI: '' }

  runNode(postinstall, [], env)
  assert.ok(fs.existsSync(path.join(skillDir(home, '.claude'), 'SKILL.md')))
  assert.ok(!fs.existsSync(skillDir(home, '.cursor')), "no client we don't use")
  const n1 = fs.readdirSync(
    path.join(skillDir(home, '.claude'), 'reference')
  ).length

  runNode(postinstall, [], env)
  const n2 = fs.readdirSync(
    path.join(skillDir(home, '.claude'), 'reference')
  ).length
  assert.equal(n2, n1, 'idempotent')

  fs.rmSync(home, { recursive: true, force: true })
})

test('global postinstall installs only for detected clients', () => {
  const home = tmpHome('lustra-d-')
  fs.mkdirSync(path.join(home, '.cursor'), { recursive: true })

  runNode(postinstall, [], { HOME: home, npm_config_global: 'true', CI: '' })
  assert.ok(fs.existsSync(path.join(skillDir(home, '.cursor'), 'SKILL.md')))
  assert.ok(
    !fs.existsSync(skillDir(home, '.claude')),
    'undetected client skipped'
  )

  fs.rmSync(home, { recursive: true, force: true })
})

test('non-global install does not touch home', () => {
  const home = tmpHome('lustra-l-')
  const out = runNode(postinstall, [], {
    HOME: home,
    CI: '',
    npm_config_global: ''
  })
  assert.ok(!fs.existsSync(path.join(home, '.claude')))
  assert.match(out, /local install/)
  fs.rmSync(home, { recursive: true, force: true })
})

test('lustra install --client installs the named clients only', () => {
  const home = tmpHome('lustra-c-')
  runNode(bin, ['install', '--client', 'claude-code,cursor'], { HOME: home })
  assert.ok(fs.existsSync(path.join(skillDir(home, '.claude'), 'SKILL.md')))
  assert.ok(fs.existsSync(path.join(skillDir(home, '.cursor'), 'SKILL.md')))
  assert.ok(!fs.existsSync(skillDir(home, '.gemini')))
  fs.rmSync(home, { recursive: true, force: true })
})

test('lustra install --all installs every provider; unknown client fails', () => {
  const home = tmpHome('lustra-a-')
  runNode(bin, ['install', '--all'], { HOME: home })
  for (const { configDir } of providers) {
    assert.ok(
      fs.existsSync(path.join(skillDir(home, configDir), 'SKILL.md')),
      configDir
    )
  }
  assert.throws(() =>
    runNode(bin, ['install', '--client', 'nope'], {
      HOME: tmpHome('lustra-x-')
    })
  )
  fs.rmSync(home, { recursive: true, force: true })
})

test('lustra build via CLI regenerates every provider dir', () => {
  runNode(bin, ['build'], {})
  for (const { configDir } of providers) {
    assert.ok(
      fs.existsSync(path.join(root, configDir, 'skills', 'lustra', 'SKILL.md')),
      configDir
    )
  }
})

test('parseSelection resolves answers without a TTY', () => {
  const { parseSelection } = require('../bin/lustra.js')
  const ids = sel => sel.map(p => p.provider)

  assert.deepEqual(ids(parseSelection('', [])), ['claude-code'])
  assert.deepEqual(ids(parseSelection('  ', [])), ['claude-code'])
  assert.deepEqual(ids(parseSelection('', [providers[1]])), [
    providers[1].provider
  ])
  assert.equal(parseSelection('all', []).length, providers.length)
  assert.equal(parseSelection('ALL', []).length, providers.length)
  assert.deepEqual(ids(parseSelection('cursor,gemini', [])), [
    'cursor',
    'gemini'
  ])
  assert.deepEqual(ids(parseSelection('1,4', [])), [
    providers[0].provider,
    providers[3].provider
  ])
  assert.throws(() => parseSelection('nope', []), /unknown client/)
})

test('lustra help lists every command and client', () => {
  const out = runNode(bin, ['help'], {})
  for (const { provider } of providers) assert.match(out, new RegExp(provider))
  const commands = fs
    .readdirSync(path.join(root, 'skill', 'reference'))
    .map(f => f.replace(/\.md$/, ''))
  for (const cmd of commands) assert.match(out, new RegExp(`/lustra ${cmd}\\b`))
})
