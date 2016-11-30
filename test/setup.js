import Vue from 'vue'

window.shallow = (o = {})=> {
  const vm = new Vue(o).$mount()
  return vm.$children[0]
}

window.mount = (Compo, propsData) => {
  const Ctor = Vue.extend(Compo)
  return new Ctor({ propsData }).$mount()
}

window.$ = require('cash-dom')
