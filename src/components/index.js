import { isBrowser } from './is-env'

if (process.env.NODE_ENV === 'build' && isBrowser) {
  const style = document.createElement('style')
  style.textContent = require('raw-loader!~dist/owl-ui.css')

  document.head.appendChild(style)
}

// exports by automation
module.exports
