import { isBrowser } from './is-env'

if (process.env.NODE_ENV === 'build' && isBrowser) {
  const style = document.createElement('style')
  style.textContent = require('raw!~dist/owl-ui.css')

  document.head.appendChild(style)
}

module.exports = {
  Button: require('./button'),
  Checkbox: require('./checkbox'),
  Grid: require('./grid'),
  Icon: require('./icon'),
  Input: require('./input'),
  LightBox: require('./lightbox'),
  Loading: require('./loading'),
  Radio: require('./radio'),
  Select: require('./select'),
  Switch: require('./switch'),
  Tip: require('./tip'),
}
