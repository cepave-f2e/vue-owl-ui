import Message from '../../../components/message'
import Button from '../../../components/button'
import Markdown from '../../components/markdown'

const MessagePage = {
  name: 'MessagePage',
  methods: {
    open() {
      Message('Hello!')
    },
    open_warning(event) {
      event.preventDefault()
      const vm = Message({
        message: 'Warning!',
        type: 'warning',
        duration: 0,
        showClose: true,
      })
    },
  },

  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <Button status="primaryOutline" nativeOnClick={this.open}>Hello message!</Button>
        <br />
        <a href="#" onClick={this.open_warning}>Warning</a>
      </div>
    )
  },
}

module.exports = MessagePage
