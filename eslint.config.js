const vuePlugin = require('eslint-plugin-vue');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type {import('eslint').FlatConfig} */
const config = [
  {
    // すべてのファイルに適用される基本設定
    plugins: {
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // 必要なルールを設定
    },
  },
  {
    // Vue ファイル専用の設定
    files: ['*.vue'],
    rules: {
      'vue/attribute-hyphenation': 'error',
      'vue/script-setup-uses-vars': 'error',
    },
  },
  {
    // JavaScript/TypeScript ファイル専用の設定
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

module.exports = config;
