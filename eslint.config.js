import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**'],
  rules: {
    'ts/no-explicit-any': 'off',
    'no-console': 'off',
    'brace-style': ['error', '1tbs'],
    'style/brace-style': ['error', '1tbs'],
  },
})
