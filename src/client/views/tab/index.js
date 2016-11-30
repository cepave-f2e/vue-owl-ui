import Tab from '../../../components/tab'
import Markdown from '../../components/markdown'

const TabPage = {
  name: 'TabPage',
  data() {
    return {
      tabData: { idx: 1, name: '2' }
    }
  },
  methods: {
    getTabData(data) {
      this.tabData = data
    }
  },

  render(h) {
    const { tabData, getTabData } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div>
          <Tab onChange={getTabData}>
            <Tab.Head slot="tabHead" name="1">Tab1</Tab.Head>
            <Tab.Head slot="tabHead" isSelected={true} name="2">Tab2</Tab.Head>
            <Tab.Content slot="tabContent" name="1">
              <br />
              Hello, I am tab one
            </Tab.Content>
            <Tab.Content slot="tabContent" name="2">
              <br />
              This is tab two
            </Tab.Content>
          </Tab>
          <br />
          <code>
            {JSON.stringify(tabData)}
          </code>
        </div>
      </div>
    )
  }
}

module.exports = TabPage
