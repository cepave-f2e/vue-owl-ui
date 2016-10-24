import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

module.exports = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/home', component: require('./views/home') },
    { path: '/loading', component: require('./views/loading') },
    { path: '/switch', component: require('./views/switch') },
    { path: '/icons', component: require('./views/icons') },
<<<<<<< 418b4a07bae11fd33a3f3dd2126a2386687c5c27
    { path: '/tip', component: require('./views/tip') },
    { path: '/checkbox', component: require('./views/checkbox') },
=======
    { path: '/radio', component: require('./views/radio') },
>>>>>>> [OWL-939] [OWL-940] <Radio> doc
    { path: '*', redirect: '/home' },
  ],
})
