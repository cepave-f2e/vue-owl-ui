import Markdown from '../../components/markdown'

const CompnentHomePage = {
  name: 'CompnentHomePage',
  data() {
    return {
      loading: true,
      owlSrc: '',
    }
  },

  methods: {

  },

  mounted() {

  },
  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
      </div>
    )
  },
}

module.exports = CompnentHomePage
