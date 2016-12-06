import Vue from 'vue'
import router from './router'
import s from './app.scss'

import Footer from './components/footer'
import Header from './components/header'

module.exports = new Vue({
  router,

  mounted() {

  },

  data() {
    return {}
  },

  computed: {

  },

  render(h) {
    const { $route } = this

    return (
      <div id="app" data-path={$route.path}>
        <Header />
        <keep-alive>
          <router-view class="main" />
        </keep-alive>
        <Footer />
      </div>
    )
  }
})
