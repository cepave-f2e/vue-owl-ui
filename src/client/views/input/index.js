import Input from '../../../components/input'
import Markdown from '../../components/markdown'
import s from './input.scss'

const InputPage = {
  name: 'InputPage',
  data() {
    return {
      outputName: 'demo',
      outputValue: ''
    }
  },
  methods: {
    handleSubmit(e) {
      this.outputValue = this.$refs.inputRef.getInputValue().demo
    }
  },
  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')}/>
        <div class={[s.wrapper]}>
          <Input name="demo" icon={['search', '#919799']} status="normal" placeholder="type some words.." ref="inputRef"/>
          <div on-click={this.handleSubmit} class={[s.submit]}>Submit</div>
          <div class={[s.demo]}>{ this.outputName } : { this.outputValue }</div>
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input password={true}/>
        </div>
      </div>
    )
  }
}

module.exports = InputPage
