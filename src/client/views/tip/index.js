import Tip from '../../../components/tip'
import Markdown from '../../components/markdown'

const TipPage = {
  name: 'TipPage',

  render(h) {
    const { $slots } = this

    return (
      <div>
        <Markdown src={ require('./doc.md') } />

        <h2>pos="right"</h2>
        <Tip pos="right">
          hover me
          <Tip.Context>
            I am a tip
          </Tip.Context>
        </Tip>

        <h2>pos="up"</h2>
        <Tip pos="up">
          hover me
          <Tip.Context>
            I am a tip
          </Tip.Context>
        </Tip>

        <h2>pos="left"</h2>
        <Tip pos="left">
          hover me
          <Tip.Context>
            I am a tip
          </Tip.Context>
        </Tip>

        <h2>pos="down"</h2>
        <Tip pos="down">
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
