import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

module.exports = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/home', component: require('./views/home') },
    { path: '*', redirect: '/home' }
  ]
})

