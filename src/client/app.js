import Vue from 'vue'
import router from './router'
import './app.scss'

module.exports = new Vue({
  router,

  mounted() {

  },

  data() {
    return {
      url: {}
    }
  },

  computed: {
    View() {
      const { $route, url } = this

      return ($route.matched[0].components.default)
    }
  },

  render(h) {
    const { $slots, View } = this

    return (
      <div id="app">
        <View />
      </div>
    )
  }
})
