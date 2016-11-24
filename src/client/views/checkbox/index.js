import Checkbox from '../../../components/checkbox'
import Markdown from '../../components/markdown'

const CheckboxPage = {
  name: 'CheckboxPage',
  data() {
    return {
      checkedDatum: { 1: true, 2: true, all: true }
    }
  },
  methods: {
    getCheckedDatum(data) {
      this.checkedDatum = data
    }
  },
  render(h) {
    const { getCheckedDatum, checkedDatum } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div>
          <code>
            {JSON.stringify(checkedDatum)}
          </code>
        </div>
        <br />
        <div>
          <Checkbox.Group onChange={getCheckedDatum}>
            <Checkbox name="all" checked={true}>All</Checkbox>
            <Checkbox name="1">Pikachu</Checkbox>
            <Checkbox name="2">Eevee</Checkbox>
          </Checkbox.Group>
        </div>
      </div>
    )
  }
}

module.exports = CheckboxPage
