import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // The codebase intentionally uses `any` for API/mock JSON payloads. Keep the
      // rule visible as a warning but don't fail the build on it.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Several pre-existing pages set state directly inside effects to hydrate
      // from localStorage. Downgrade this newer strict rule to a warning.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
