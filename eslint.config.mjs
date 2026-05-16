import js from '@eslint/js'
import globals from 'globals'

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      'node_modules/',
      '.claude/',
      '.agents/',
      '.cursor/',
      '.gemini/',
      '.codex/',
      '.github/skills/',
      '.kiro/',
      '.opencode/',
      '.qoder/',
      'test/fixtures/',
      'test/fixtures-py/'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { ...globals.node }
    }
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node }
    }
  }
]
