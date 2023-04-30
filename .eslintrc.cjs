/* eslint-env node */
module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'max-len': ['error', { code: 140 }],
    'no-console': 'off',
    'import/extensions': ['error', 'always', { ts: 'never' }],
    'no-underscore-dangle': 'off',
  },
};
