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
    const { md, $el } = this

    md.mountToTextArea($el)
  },

  render(h) {
    const { src } = this

    return (
      <textarea hidden>{src}</textarea>
    )
  }
}

module.exports = Markdown
