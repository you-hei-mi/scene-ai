import createConfig from '@buildingai/eslint-config/base'

export default [
  ...createConfig(),
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'node_modules/**',
    ],
  },
]
