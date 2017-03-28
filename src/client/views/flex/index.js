import Flex from '~com/flex'
import Markdown from '../../components/markdown'
import s from './flex.scss'

const FlexPage = {
  name: 'FlexPage',
  render(h) {
    const { $slots } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />

        <h2>Auto</h2>
        <Flex>
          <Flex.Col size="auto"><p class={[s.p]}>size="auto"</p></Flex.Col>
          <Flex.Col size="auto"><p class={[s.p]}>size="auto"</p></Flex.Col>
          <Flex.Col size="auto"><p class={[s.p]}>size="auto"</p></Flex.Col>
        </Flex>

        <h2>12 Grids</h2>
        <div class={s.boxs}>
          { [...Array(6)].map((v, i) => {
            const left = i + 1
            const right = 12 - left
            return (
              <Flex>
                <Flex.Col size={left}><p class={[s.p]}>size="{left}"</p></Flex.Col>
                <Flex.Col size={right}><p class={[s.p]}>size="{right}"</p></Flex.Col>
              </Flex>
            )
          }) }
        </div>

        <h2>Offset</h2>
        <div class={s.boxs}>
          { [...Array(6)].map((v, i) => {
            const left = i + 1
            const offset = 12 - 5 - left
            return (
              <Flex>
                <Flex.Col size={left}><p class={[s.p]}>size="{left}"</p></Flex.Col>
                <Flex.Col size={5} offset={offset}><p class={[s.p]}>size="5", offset="{offset}"</p></Flex.Col>
              </Flex>
            )
          }) }
        </div>

        <h2>Split</h2>
        <Flex split>
          <Flex.Col>
            <p class={[s.p]}>Left</p>
          </Flex.Col>
          <Flex.Col>
            <p class={[s.p]}>Right</p>
          </Flex.Col>
        </Flex>

        <h2>Mid</h2>
        <Flex mid class={[s.midContent]} >
          Mid Content
        </Flex>

        <h2>Social Example</h2>
        <Flex class={[s.social]} margin={12}>
          <Flex.Col >
            <div class={[s.avatar]}>
              <Flex mid>
                avatar <br /> 76 x 76
              </Flex>
            </div>
          </Flex.Col>
          <Flex.Col size="auto">
            <p>Cepave @cepave said:</p>
            <p>OWL UI is No.1. :)</p>
          </Flex.Col>
        </Flex>
      </div>
    )
  },
}

module.exports = FlexPage
