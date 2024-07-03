import antfu from '@gabortorma/antfu-eslint-config'

export default antfu({
  typescript: {
    tsconfigPath: './tsconfig.test.json',
  },
}, {
  rules: {
    'ts/strict-boolean-expressions': 'off',
  },
})
