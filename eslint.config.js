import antfu from '@gabortorma/antfu-eslint-config'

export default antfu({
  typescript: {
    parserOptions: {
      project: [
        'tsconfig.json',
        'tsconfig.test.json',
      ],
    },
  },
}, {
  rules: {
    'ts/strict-boolean-expressions': 'off',
  },
})
