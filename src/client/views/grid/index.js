import Grid from '~com/grid'
import Markdown from '../../components/markdown'
import Switch from '~com/switch'
import Flex from '~com/flex'

const GridPage = {
  name: 'GridPage',
  data() {
    return {
      gridData: {
        heads: [
          {
            name: <b>Name</b>,
            key: 'name',
            sort: -1,
            width: '30%',
          },
          {
            key: 'email',
            width: '50%',
            name: 'Email',
          },
          {
            key: 'id',
            width: '20%',
            name: '#ID',
            sort: -1,
          },
        ],

        rows: [
          {
            name: 'Rocky',
            email: 'rwu@cepave.com',
            id: 2,
          },
          {
            name: 'Timmy',
            email: 'timmy@cepave.com',
            id: 1,
          },
          {
            name: 'Kelly',
            email: 'kelly@cepave.com',
            id: 3,
          },
        ],

        loading: false,
      },

    }
  },

  methods: {
    toggleLoading({ data }) {
      this.gridData.loading = data
    },
  },

  render(h) {
    const { $slots, gridData } = this
    const props = {
      ...gridData,
    }

    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <Flex style={{ marginBottom: '20px' }}>
          <Flex.Col>
            <Switch onChange={this.toggleLoading} />
          </Flex.Col>
          <Flex.Col mid style={{ height: 'auto' }}>
            Toggle Loading
          </Flex.Col>
        </Flex>
        <Grid {...{ props }} />
      </div>
    )
  },
}

module.exports = GridPage
