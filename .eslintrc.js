module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:react/recommended',
    'plugin:prettier/recommended', // 添加 prettier 插件
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier', // 添加 prettier 插件
  ],
  rules: {
    'prettier/prettier': 'error', // 开启 prettier 规则
    'no-unused-vars': 0,
    'no-undef': 0,
  },
};