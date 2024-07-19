import antfu from '@gabortorma/antfu-eslint-config'

export default antfu({
  typescript: {
    parserOptions: {
      project: [
        'tsconfig.json',
        'tsconfig.test.json',
        'tsconfig.release.json',
      ],
    },
  },
}, {
  rules: {
    'ts/strict-boolean-expressions': 'off',
  },
})
