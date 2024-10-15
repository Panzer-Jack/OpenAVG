import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['node_modules', '**/node_modules/**', 'dist', '**/dist/**'],
  typescript: {
    overrides: {
      'ts/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

})
