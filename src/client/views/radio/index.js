import Radio from '../../../components/radio'
import Markdown from '../../components/markdown'

const RadioPage = {
  name: 'RadioPage',
  data() {
    return {
      radioDatum: { piglet: false, tigger: false, winnieThePooh: true }
    }
  },
  methods: {
    getRadioData(data) {
      this.radioDatum = data
    }
  },
  render(h) {
    const { getRadioData, radioDatum } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div>
          <code>
            {JSON.stringify(radioDatum)}
          </code>
        </div>
        <br />
        <Radio.Group onChange={getRadioData}>
          <Radio name="piglet">Piglet</Radio>
          <Radio name="tigger">Tigger</Radio>
          <Radio name="winnieThePooh" on={true}>Winnie the Pooh</Radio>
        </Radio.Group>
      </div>
    )
  }
}

module.exports = RadioPage
