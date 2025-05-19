module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:import/errors', // enabling import errors
    'plugin:import/warnings', // enabling import warnings,
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['unused-imports'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'import/no-duplicates': 2, // disabling multiple lines import from same file
    'no-console': 2, // disabling console statement
    'unused-imports/no-unused-imports': 2, // remove unsed imports
    'import/no-named-as-default': 0,
    'import/default': 0,
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // first of all import builtin modules like fs, path, etc..
          'external', // then third party libraries like lodash etc..
          'internal', // then our internal absolute imports
          'index', // then relatively import something from current directory
          'sibling', // then relatively import something inside nested directory of current directory
          'parent', // then relatively import some thing from parent directory
          'object', // lastly object if any,
          'unknown'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order:
            'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */
        }
      }
    ]
  }
}