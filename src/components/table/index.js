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

  computed: {
    headWidths() {
      const { heads } = this
      const colNum = heads.length
      let fullAssignWidth = true
      heads.forEach((val, idx) => {
        if (!val.width) {
          fullAssignWidth = false
          return
        }
      })
      if (!fullAssignWidth) {
        const width = 100 / colNum
        const heads = this.heads.reduce((preVal, curVal, idx) => {
          preVal.push({ ...curVal, width: `${width}%` })
          return preVal
        }, [])
        return heads
      } else {
        return this.heads
      }
    }
  },

  methods: {
    renderElements(row) {
      const h = this.$createElement
      const { headWidths } = this
      return headWidths.map((head) => {
        return (
          <td style={`width:${head.width}`}>{row[head.col]}</td>
        )
      })
    }
  },

  render(h) {
    const { rows, feet, typ, renderElements, headWidths } = this
    return (
      <table class={[s[typ]]}>
        <thead>
          <tr>
            {
              headWidths.map((head) => {
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
