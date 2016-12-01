import s from './table.scss'

const Table = {
  name: 'Table',

  props: {
    heads: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    feet: {
      type: Array,
      default: () => [],
    },
    typ: {
      type: String,
      default: 'base'//bordered, striped, flat
    }

  },

  methods: {
    renderElements(row) {
      const h = this.$createElement
      const { heads } = this
      return heads.map((head) => {
        return (
          <td style={`width:${head.width}`}>{row[head.col]}</td>
        )
      })
    }
  },

  render(h) {
    const { heads, rows, feet, typ, renderElements } = this
    return (
      <table class={[s[typ]]}>
        <thead>
          <tr>
            {
              heads.map((head) => {
                const colName = head.col.replace(/\_/g, ' ')
                return (
                  <th style={`width:${head.width}`}>{colName}</th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
            {
              rows.map((row) => {
                return (
                  <tr>
                    { renderElements(row) }
                  </tr>
                )
              })
            }
        </tbody>
        {
          (feet.length) &&
          <tfoot>
            <tr>
              {
                feet.map((foot) => {
                  return (
                    <td colSpan={foot.colspan}>{foot.val}</td>
                  )
                })
              }
            </tr>
          </tfoot>
        }
      </table>
    )
  }
}
module.exports = Table
