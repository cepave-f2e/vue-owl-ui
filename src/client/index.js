import App from './app'

App.$mount('#app')

if (module.hot) {
  module.hot.accept()
}
