import Switch from '../../../components/switch'
import Markdown from '../../components/markdown'
import s from './switch.scss'

const SwitchPage = {
  name: 'SwitchPage',
  data () {
    return {
      outputName: 'demo',
      outputValue: 'true'
    }
  },

  render(h) {
    const { $slots } = this
    const getSwitchData = (data) => {
      this.outputName = Object.keys(data)[0]
      this.outputValue = data[Object.keys(data)[0]].toString()
    }
    return (
      <div>
        <Markdown src={require('./switch.md')} />
        <div class={[s.demo]}>
          <Switch checked={true} name="demo" onChange={getSwitchData} />
          <span class={[s.demoMsg]}>{this.outputName} : {this.outputValue}</span>
        </div>
      </div>
    )
  }
}

module.exports = SwitchPage
