import DatePicker from '..'

describe('DatePicker', () => {
  it('Default render', ()=> {
    const vm = mount(DatePicker, {})

    expect(vm).toBeTruthy()
  })

  it('test if has `colorfulWeekend`', ()=> {
    const vm = mount(DatePicker, { colorfulWeekend: true })

    expect($(vm.$el).find('.colorfulWeekend').length).toBe(1)
  })

  it('click `next`', (done)=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 5]
    })

    vm.$on('next', (d) => {
      expect(d).toEqual({
        year: 2017,
        month: 6
      })
      done()
    })

    expect(vm.month).toBe(5)
    const $el = $(vm.$el)
    $el.find('.calNext').trigger('click')
  })

  it('click `prev`', (done)=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 5]
    })

    vm.$on('prev', (d) => {
      expect(d).toEqual({
        year: 2017,
        month: 4
      })
      done()
    })

    expect(vm.month).toBe(5)
    const $el = $(vm.$el)
    $el.find('.calPrev').trigger('click')
  })

  it('test `onPick`', (done)=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 5]
    })
    vm.$on('pick', (d) => {
      expect(d).toMatchObject({
        year: 2017,
        month: 5,
        date: 10,
        value: '2017/05/10',
      })
      done()
    })
    const $el = $(vm.$el)
    $el.find('[data-date="10"]').trigger('click')
  })
})
