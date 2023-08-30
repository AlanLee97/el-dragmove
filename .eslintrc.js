module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['dist/*.js'],
  rules: {
    // 0 - off, 1 - warn, 2 - error
    'import/extensions': 1,
    'no-param-reassign': 1,
    'import/prefer-default-export': 0,
    'global-require': 1,
    'default-param-last': 1,
    'prefer-const': 1,
    'max-len': 0,
    'import/no-extraneous-dependencies': 0,
    'linebreak-style': 0,
    'class-methods-use-this': 0,
    'no-useless-escape': 1,
  },
};
