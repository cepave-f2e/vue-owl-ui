import Vue from 'vue'
import router from './router'

module.exports = new Vue({
  router,
  render(h) {
    const { $slots, $route } = this
    const View = ($route.matched[0].components.default)

    return (
      <div id="app">
        7777
        <View />
        2222
      </div>
    )
  }
})
