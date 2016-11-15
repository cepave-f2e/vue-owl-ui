import Grid from '~com/grid'

const GridPage = {
  name: 'GridPage',
  data() {
    return {
      gridData: {
        heads: [
          {
            col: 'item 1',
            sort: -1,
            width: '40%',
            render(h, head) {
              return (
                <b>{head.col}</b>
              )
            }
          },
          {
            width: '60%',
            col: 'item 2'
          }
        ],
        rowsRender(h, row) {
          return [
            <Grid.Col>{row[0].col}</Grid.Col>,
            <Grid.Col>{row[1].col}</Grid.Col>,
          ]
        },

        rows: [
          [
            {
              col: 11111111
            },
            {
              col: 222222222
            }
          ],
          [
            {
              col: 4444
            },
            {
              col: 33333
            }
          ]
        ]
      }
    }
  },

  render(h) {
    const { $slots, gridData } = this
    const props = {
      ...gridData
    }

    return (
      <div>
        { $slots.default }
        <Grid {...{ props }} />
      </div>
    )
  }
}

module.exports = GridPage
