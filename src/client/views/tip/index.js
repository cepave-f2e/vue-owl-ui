import Tip from '../../../components/tip'
import Markdown from '../../components/markdown'

const TipPage = {
  name: 'TipPage',

  render(h) {
    const { $slots } = this

    return (
      <div>
        <Markdown src={ require('./doc.md') }/>
        <Tip pos="right">
          hover me
          <Tip.Context>
            I am a tip
          </Tip.Context>
        </Tip>
      </div>
    )
  }
}

module.exports = TipPage
