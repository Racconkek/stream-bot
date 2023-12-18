module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
  },
  plugins: ['simple-import-sort', 'import', 'unused-imports'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:compat/recommended',
    'plugin:react/jsx-runtime',
  ],
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    'id-match': ['error', '^(?<only_ascii_symbols>[\x00-\x7F]+)$'],
    'react/prop-types': 'off',
    'react/display-name': 'warn',
    'react/jsx-max-depth': [1, { max: 4 }],
    'react/sort-comp': [
      1,
      {
        order: [
          '/^@injectProperty.+$/',
          'statics',
          'instance-variables',
          'constructor',
          'setters',
          'getters',
          'lifecycle',
          'render',
          '/^render.+$/',
          '/.*Renderer$/',
          '/^handle.+$/',
          '/.*Handler$/',
          'instance-methods',
          'everything-else',
        ],
      },
    ],
    'prettier/prettier': 'warn',
    'dot-notation': 'error',
    'no-unreachable': 'error',
    'no-else-return': 'error',
    'no-useless-rename': 'error',
    'rest-spread-spacing': 'error',
    'no-useless-computed-key': 'error',

    // disable the base rule and enable typescript rule
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',

    // disable the base rule and enable typescript rule
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': [
      'warn',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],

    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'unused-imports/no-unused-imports': 'error',

    'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'never' }],
    'no-restricted-imports': 'off',
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: [{ name: 'lodash', message: 'Import from concrete subpackage (lodash.FOO)' }],
      },
    ],
  },

  overrides: [
    {
      files: ['{babel,postcss,webpack,jest}*.config.{js,cjs}', './scripts/**/*.{js,cjs}'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
    {
      files: ['./src/**/*.d.ts'],
      rules: {
        'no-var': 0,
      },
    },
  ],
};
