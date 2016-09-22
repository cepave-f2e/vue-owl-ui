import Vue from 'vue'

const { body } = document
const div = document.createElement('div')
div.id = 'jest'

body.appendChild(div)

window.shallow = (o = {})=> {
  div.innerHTML = `<div id="test"></div>`
  const vm = new Vue(o).$mount('#test')

  return vm.$children[0]
}
