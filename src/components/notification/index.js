import Vue from 'vue'
import { isBrowser } from '../is-env'
const NotificationConstructor = Vue.extend(require('./notification'))
let seed = 0

let notiDiv
const NotiDivID = 'owl-ui-notification'
if (isBrowser && !document.querySelector(`#${NotiDivID}`)) {
  notiDiv = document.createElement('div')
  notiDiv.id = NotiDivID
  notiDiv.style.top = '100px'
  notiDiv.style.right = '30px'
  notiDiv.style.position = 'fixed'

  document.body.appendChild(notiDiv)
}

let instance
Notification.newInstance = function() {
  return {
    notice(noticeProps) {
      seed += 1
      const id = seed

      instance = new NotificationConstructor({
        data: {
          ...noticeProps,
          id,
        },
      })
      instance.vm = instance.$mount()
      notiDiv.appendChild(instance.vm.$el)
    },

    // close(key) {
    //   //close from outside feature: pending
    //   //use instances array to keep ids
    // },
  }
}

module.exports = Notification