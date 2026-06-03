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
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // === Code Style & Formatting ===
      // Single quotes pour les strings
      'quotes': ['error', 'single', { avoidEscape: true }],
      
      // Semicolons obligatoires
      'semi': ['error', 'always'],
      
      // Trailing commas (objets, arrays sur plusieurs lignes)
      'comma-dangle': ['error', 'always-multiline'],
      
      // Espaces autour des opérateurs
      'space-infix-ops': 'error',
      
      // Espace avant les blocks
      'space-before-blocks': 'error',
      
      // Espace dans les objets
      'object-curly-spacing': ['error', 'always'],
      
      // Espace dans les arrays
      'array-bracket-spacing': ['error', 'never'],
      
      // Pas d'espaces multiples
      'no-multi-spaces': 'error',
      
      // Pas de trailing spaces
      'no-trailing-spaces': 'error',

      // === Code Quality ===
      // Longueur max des lignes (120 caractères)
      'max-len': ['warn', { 
        code: 120, 
        ignoreUrls: true, 
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
      
      // Complexité cyclomatique max
      'complexity': ['warn', 10],
      
      // Profondeur max des callbacks
      'max-depth': ['warn', 4],
      
      // Nombre max de paramètres
      'max-params': ['warn', 4],
      
      // Pas de console.log (warn seulement)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      
      // Pas de variables non utilisées
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // === TypeScript ===
      // Pas de any (warn pour migration progressive)
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Interface plutôt que type pour les objets
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      
      // Imports de types avec "import type"
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
      }],

      // === Ordre et Organisation ===
      // Ordre des imports
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      }],
      
      // Pas de default export multiples
      'no-duplicate-imports': 'error',
    },
  },
])
