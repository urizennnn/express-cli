module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'prettier/prettier': ['error', {
      'endOfLine': 'auto',
    }],
  },
};
;
