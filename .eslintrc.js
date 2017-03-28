module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'import',
    'react',
  ],
  rules: {
    // spacing
    'no-mixed-spaces-and-tabs': ['error'],
    'no-trailing-spaces': ['error'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'spaced-comment': ['error', 'always'],
    'no-multi-spaces': ['error'],
    'no-whitespace-before-property': 1,
    'object-curly-spacing': ['error', 'always'],
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-in-parens': ['error', 'never'],
    'space-unary-ops': ['error', { words: true, nonwords: false }],
    'array-bracket-spacing': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'block-spacing': ['error', 'always'],

    // comma
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],

    'no-debugger': ['error'],
    'no-unused-vars': 0,
    'no-const-assign': ['error'],
    'no-var': ['error'],
    'indent': ['error', 2],
    'object-shorthand': ['error', 'always'],
    'quote-props': ['warn', 'as-needed'],
    'no-array-constructor': ['error'],
    'no-new-object': ['error'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-const': ['error'],
    'prefer-template': ['error'],
    'prefer-spread': ['error'],
    'prefer-rest-params': ['error'],
    'padded-blocks': ['error', 'never'],
    'eqeqeq': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'no-loop-func': ['error'],
    'dot-notation': ['error'],
    'camelcase': ['error', { properties: 'never' }],
    'semi': ['error', 'never'],

    // jsx
    'react/jsx-space-before-closing': ['warn', 'always'],
  },
}
