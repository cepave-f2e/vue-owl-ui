import Vue from 'vue'

window.shallow = (o = {})=> {
  const vm = new Vue(o).$mount()
  return vm.$children[0]
}

window.$ = require('cash-dom')
