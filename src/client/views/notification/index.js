import Notification from '../../../components/notification'
import Icon from '../../../components/icon'
import Button from '../../../components/button'
import Markdown from '../../components/markdown'
import s from './notification.scss'
const notification = Notification.newInstance({})

const NotificationPage = {
  name: 'NotificationPage',

  methods: {
    openNoti1(e) {
      console.log('clicked');
      notification.notice({
        duration: 5000,
        title: '設備組新增成功',
        message: '#1 cepave_test 新增成功cepave_test 新增成功cepave_test 新增成功cepave_test 新增成功cepave_test 新增成功',
      })
    },
    openNoti2(e) {
      notification.notice({
        title: '設備組新增失敗',
        message: '#1 cepave_test 設備組新增失敗',
      })
    },
  },

  render(h) {
    const { openNoti1, openNoti2 } = this
    return (
      <div>
        <Button nativeOn-click={openNoti1}>noti1</Button>
        <Button nativeOn-click={openNoti2}>noti2</Button>
      </div>
    )
  }
}

module.exports = NotificationPage
