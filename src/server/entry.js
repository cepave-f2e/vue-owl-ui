import router from '../client/router'
import app from '../client/app'

export default (context) => {
  router.push(context.url)

  return app

  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.preFetch) {
      return component.preFetch(store)
    }
  })).then(() => {
    isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)

    context.initialState = store.state
    return app
  })
}
