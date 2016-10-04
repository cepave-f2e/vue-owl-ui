import MarkItDown from 'mark-it-down'

const Markdown = {
  name: 'Markdown',
  props: {
    src: {
      type: String,
      default: '',
    },
    opts: {},
  },


  created() {
    const { opts } = this

    this.md = new MarkItDown(opts)
  },

  mounted() {

  },

  render(h) {
    const { src, md } = this

    return (
      <div domProps-innerHTML={md.toHTML(src)} />
    )
  }
}

module.exports = Markdown
