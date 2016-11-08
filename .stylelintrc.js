module.exports = {
  rules: {
    'indentation': 2,

    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-named': 'never',
    'color-no-invalid-hex': true,

    'font-weight-notation': 'numeric',

    'number-leading-zero': 'never',
    'number-no-trailing-zeros': true,

    'length-zero-no-unit': true,
    'time-no-imperceptible': true,

    'value-keyword-case': 'lower',
    'value-no-vendor-prefix': true,

    'max-nesting-depth': 3,
    'max-empty-lines': 2,

    'no-duplicate-selectors': true,
    'no-descending-specificity': true,
    // 'no-browser-hacks': true,
    'no-extra-semicolons': true,
    'no-eol-whitespace': true,
    'no-unknown-animations': true,

    'comment-no-empty': true,
    'stylelint-disable-reason': 'always-before',

    /**
     * selector
     * @url: http://stylelint.io/user-guide/rules/#selector
     */
    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-quotes': 'always',
    'selector-combinator-space-before': 'always',
    'selector-combinator-space-after': 'always',
    'selector-descendant-combinator-no-non-space': true,
    'selector-max-compound-selectors': 3,
    'selector-no-id': true,
    'selector-no-vendor-prefix': true,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'single',
    'selector-type-case': 'lower',

    /**
     * selector list
     * @url: http://stylelint.io/user-guide/rules/#selector-list
     */
    'selector-list-comma-space-before': 'never',
    'selector-list-comma-space-after': 'always',

    /**
     * at rules
     * @url: http://stylelint.io/user-guide/rules/#at-rule
     */
    'at-rule-no-vendor-prefix': true,
    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always',
    'at-rule-semicolon-newline-after': 'always',

    /**
    * curly brace
    * @url: http://stylelint.io/user-guide/rules/#block
    */
    'block-opening-brace-space-before': 'always'
  }
}
