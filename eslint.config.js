import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: reactPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      
      ...js.configs.recommended.rules,
      ...(reactPlugin.configs?.recommended?.rules || {}),
      ...(importPlugin.configs?.recommended?.rules || {}),
      ...(jsxA11y.configs?.recommended?.rules || {}),
      ...(reactHooks.configs?.recommended?.rules || {}),

      
      'react/prop-types': 'off', 
      'no-console': 'warn',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', args: 'after-used' }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
      'jsx-a11y/anchor-is-valid': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];