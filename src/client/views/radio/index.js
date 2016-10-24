import Radio from '../../../components/radio'
import Markdown from '../../components/markdown'

const RadioPage = {
  name: 'RadioPage',
  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <Radio.Group>
          <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
          <Radio name="piglet">Piglet</Radio>
          <Radio name="tigger">Tigger</Radio>
        </Radio.Group>
      </div>
    )
  }
}

module.exports = RadioPage
