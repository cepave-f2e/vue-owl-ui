const isNode = !(typeof window !== 'undefined' &&
  window.document &&
  document.createElement)

if (process.env.NODE_ENV === 'build' && !isNode) {
  const iconRaw = require('raw!~dist/owl-ui.svg')
  const classRaw = require('raw!~dist/owl-ui.css')

  const style = document.createElement('style')
  style.textContent = classRaw

  const div = document.createElement('div')
  div.innerHTML = iconRaw
  div.id = 'owl-ui-icons'

  document.head.appendChild(style)
  document.body.appendChild(div)
}

module.exports = {
  Select: require('./select')
}
