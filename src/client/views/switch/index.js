import Switch from '../../../components/switch'
import Markdown from '../../components/markdown'
import s from './switch.scss'

const SwitchPage = {
  name: 'SwitchPage',
  data () {
    return {
      switch1Data: { demo1: true },
      switch2Data: { demo2: true }
    }
  },
  methods: {
    getSwitch1Data(data) {
      this.switch1Data = data
    },
    getSwitch2Data(data) {
      this.switch2Data = data
    }
  },

  render(h) {
    const { getSwitch1Data, switch1Data, getSwitch2Data, switch2Data } = this

    return (
      <div>
        <Markdown src={require('./switch.md')} />
        <div class={[s.title]}>Default Switch Button</div>
        <div class={[s.demo]}>
          <Switch checked={true} name="demo1" onChange={getSwitch1Data} />
          <span class={[s.demoMsg]}>
            <code>
              {JSON.stringify(switch1Data, null, 2)}
            </code>
          </span>
        </div>
        <div class={[s.title]}>Special Switch Button</div>
        <div class={[s.demo]}>
          <Switch checked={true} name="demo2" typ="special" onChange={getSwitch2Data}>
            <Switch.Open>開</Switch.Open>
            <Switch.Close>關</Switch.Close>
          </Switch>
          <span class={[s.demoMsg]}>
            <code>
              {JSON.stringify(switch2Data, null, 2)}
            </code>
          </span>
        </div>
      </div>
    )
  }
}

module.exports = SwitchPage
