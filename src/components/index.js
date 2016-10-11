const isNode = !(typeof window !== 'undefined' && window.document && document.createElement)

if (process.env.NODE_ENV === 'build' && !isNode) {
  const style = document.createElement('style')
  style.textContent = require('raw!~dist/owl-ui.css')

  document.head.appendChild(style)
}

module.exports = {
  Select: require('./select')
}
