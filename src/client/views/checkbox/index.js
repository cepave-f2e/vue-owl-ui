import Checkbox from '../../../components/checkbox'
import Markdown from '../../components/markdown'

const CheckboxPage = {
  name: 'CheckboxPage',

  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div>
          <Checkbox.Group>
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
