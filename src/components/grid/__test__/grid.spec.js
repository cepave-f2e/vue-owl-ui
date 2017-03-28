import Grid from '../'

const gridData = {
  heads: [
    {
      name: 'Name',
      key: 'name',
      sort: -1,
      width: '50%',
    },
    {
      name: 'HP',
      key: 'hp',
      width: 50,
      sort: -1,
    },
  ],
  loading: true,
  rows: [
    {
      name: 'A',
      hp: 87,
    },
    {
      name: 'B',
      hp: 8787,
    },
  ],
}

describe('Grid', () => {
  it('Normal gird render, should have 2 columns', () => {
    const vm = mount(Grid, {
      ...gridData,
    })

    expect($(vm.$el).find('.ghead [data-role=col]').length).toBe(2)
  })

  it('Test sort HP<number>', async() => {
    const vm = mount(Grid, {
      ...gridData,
    })
    const $el = $(vm.$el)

    const findFirstRowHP = () => {
      return $el.find('.gbody [data-role=row]').eq(0).find('[data-role=col]').eq(1).text()
    }
    const $hpHead = $el.find('.ghead [data-role=row] [data-role=col]').eq(1)

    expect(findFirstRowHP()).toBe('87')

    // Click for HP sorting
    $hpHead.trigger('click')
    await vm.$nextTick()
    expect(findFirstRowHP()).toBe('8787')

    // Reverse sort
    $hpHead.trigger('click')
    await vm.$nextTick()
    expect(findFirstRowHP()).toBe('87')
  })

  it('Test sort Name<string>', async() => {
    const vm = mount(Grid, {
      ...gridData,
    })
    const $el = $(vm.$el)
    const findFirstRowName = () => {
      return $el.find('.gbody [data-role=row]').eq(0).find('[data-role=col]').eq(0).text()
    }
    const $nameHead = $el.find('.ghead [data-role=row] [data-role=col]').eq(0)
    expect(findFirstRowName()).toBe('A')

    $nameHead.trigger('click')
    await vm.$nextTick()
    expect(findFirstRowName()).toBe('B')

    $nameHead.trigger('click')
    await vm.$nextTick()
    expect(findFirstRowName()).toBe('A')
  })

  it('`rowsRender`', async() => {
    const vm = mount(Grid, {
      ...gridData,
    })
    const h = vm.$createElement

    vm.rowsRender = ({ row, index }) => {
      return [
        <Grid.Col><b>{row.name}</b></Grid.Col>,
        <Grid.Col>{row.hp}</Grid.Col>,
      ]
    }

    await vm.$nextTick()

    expect($(vm.$el).find('.gbody b').length).toBe(2)
  })

  it('Dynamic update rows', async() => {
    const vm = mount(Grid, {
      ...gridData,
    })

    vm.rows = [
      ...vm.rows,
      ...vm.rows,
    ]
    await vm.$nextTick()
    expect($(vm.$el).find('.gbody [data-role=row]').length).toBe(4)

    vm.heads.forEach((head) => {
      expect(head.sort).toBe(-1)
    })
  })

  it('onsort event', (done) => {
    const vm = mount(Grid, {
      ...gridData,
    })
    .$on('sort', ({ sort, key }) => {
      expect(sort).toBe(1 || 0)
      expect(key).toBe('hp')
      done()
    })

    const $el = $(vm.$el)
    const $hpHead = $el.find('.ghead [data-role=row] [data-role=col]').eq(1)

    $hpHead.trigger('click')
    // Reverse
    $hpHead.trigger('click')
  })

  it('render for empty data', () => {
    const vm = mount(Grid, {

    })
    expect($(vm.$el).find('.ghead [data-role=col]').text()).toBe('Head')
    expect($(vm.$el).find('.ghead [data-role=col]').length).toBe(1)
  })
})
