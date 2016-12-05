import Table from '../'

it('test <Table> with props `heads` and `rows`', () => {
  const vm = mount(Table, {
    heads: [
      { col: 'pokemon', width: '50%' },
      { col: 'chinese_name', width: '50%' },
    ],
    rows: [
      { pokemon: 'Bulbasaur', chinese_name: '妙蛙種子' },
      { pokemon: 'Charmander', chinese_name: '小火龍' },
      { pokemon: 'Squirtle', chinese_name: '傑尼龜' },
    ]
  })

  expect(vm.heads).toEqual([
    { col: 'pokemon', width: '50%' },
    { col: 'chinese_name', width: '50%' }
  ])
  expect(vm.rows).toEqual([
    { pokemon: 'Bulbasaur', chinese_name: '妙蛙種子' },
    { pokemon: 'Charmander', chinese_name: '小火龍' },
    { pokemon: 'Squirtle', chinese_name: '傑尼龜' },
  ])
  $(vm.$el).find('td').each((val) => {
    expect(val.style._values.width).toBe('50%')
  })
})

it('test <Table> with props `typ` and `feet`', () => {
  const vm = mount(Table, {
    heads: [
      { col: 'pokemon', width: '33.3%' },
      { col: 'chinese_name', width: '33.3%' },
      { col: 'type', width: '33.3%' },
    ],
    rows: [
      { pokemon: 'Bulbasaur', chinese_name: '妙蛙種子', type: 'Grass Poison' },
      { pokemon: 'Charmander', chinese_name: '小火龍', type: 'Fire' },
      { pokemon: 'Squirtle', chinese_name: '傑尼龜', type: 'Water' },
    ],
    feet: [
      { val: 'total', colspan: '2' },
      { val: '155', colspan: '1' }
    ]
  })
  //9 <td> in <tbody> and 2 <td> in <tfoot>
  $(vm.$el).find('td').each((val, idx) => {
    if (idx < 9) {
      expect(val.style._values.width).toBe('33.3%')
    }
  })
  expect($(vm.$el).find(`[colSpan]`).length).toBe(2)
})
