import ComplexQuery from '~com/complex-query'
import Markdown from '../../components/markdown'

const ComplexQueryDoc = {
  name: 'ComplexQueryDoc',
  data() {
    return {
      categories: [
        {
          name: 'cat1',
          value: 'cat1',
        },
        {
          name: 'cat2',
          value: 'cat2',
        },
        {
          name: 'cat3',
          value: 'cat3',
        }
      ],

      items: [
        {
          name: 'cat1',
          children: [
            {
              name: 'cat1 - item1',
              value: 'item1'
            },
            {
              name: 'cat1 - item2',
              value: 'item2'
            },
            {
              name: 'cat1 - item3',
              value: 'item3'
            }
          ]
        },
        {
          name: 'cat2',
          children: [
            {
              name: 'cat2 - item1',
              value: 'item1.1'
            },
            {
              name: 'cat2 - item2',
              value: 'item2.1'
            },
            {
              name: 'cat2 - item3',
              value: 'item3.1'
            }
          ]
        }
      ],

      outs: {}
    }
  },

  methods: {
    onChange({ selectedItems }) {
      this.outs = selectedItems
    }
  },
  render(h) {
    const { $slots, categories, items, outs } = this

    return (
      <div>
        <h1>ComplexSearch</h1>
        <h2>Examples</h2>
        <ComplexQuery categories={categories} items={items} onChange={this.onChange} />
        <pre>
          <cdoe>
            data: {JSON.stringify(outs, null, 2)}
          </cdoe>
        </pre>
        <Markdown src={require('./doc.md')} />
      </div>
    )
  }
}
module.exports = ComplexQueryDoc
