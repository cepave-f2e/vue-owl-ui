import Vue from 'vue'

const { body } = document

const appendJestApp = ()=> {
  body.innerHTML = `<div id="jest-app"></div>`
}

appendJestApp()

global.render = (render)=> {
  const vm = new Vue({
    el: '#jest-app',
    render,
  })
  appendJestApp()
  return vm.$children[0]
}
