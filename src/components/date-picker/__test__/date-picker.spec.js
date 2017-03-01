import DatePicker from '..'
import prefix0 from '../../time-picker/prefix0'

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

  it('dynamic change `defaultValue`', async() => {
    const vm = mount(DatePicker, {
      defaultValue: '2017/03/05',
    })

    expect(vm.value).toBe('2017/03/05')

    vm.defaultValue = '2017/03/06'
    await vm.$nextTick()

    expect(vm.value).toBe('2017/03/06')
  })

  it('dynamic change `open`', async()=> {
    const vm = mount(DatePicker, {})
    expect(vm.open).toBe(false)
    vm.open = true
    await vm.$nextTick()
    expect(vm.open).toBe(true)

    vm.open = false
    await vm.$nextTick()
    expect(vm.open).toBe(false)
  })

  it('dynamic change `yearMonth`', async()=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 3]
    })

    expect(vm.year).toBe(2017)
    expect(vm.month).toBe(3)

    vm.yearMonth = [2018, 10]
    await vm.$nextTick()

    expect(vm.year).toBe(2018)
    expect(vm.month).toBe(10)
  })

  it('prev last year', async(done)=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 1]
    })

    vm.$on('prev', (d)=> {
      expect(d).toMatchObject({
        month: 12,
        year: 2016
      })
      done()
    })

    $(vm.$el).find('.calPrev').trigger('click')
  })

  it('next next yaear', ()=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 12]
    })

    vm.$on('next', (d)=> {
      expect(d).toMatchObject({
        month: 1,
        year: 2018
      })
      done()
    })

    $(vm.$el).find('.calNext').trigger('click')
  })

  it('`min and `max` date', async()=> {
    const vm = mount(DatePicker, {
      yearMonth: [2017, 3],
      max: new Date(2017, 2, 20),
      min: new Date(2017, 2, 2),
    })

    expect(vm.year).toBe(2017)
    expect(vm.month).toBe(3)

    $(vm.$el).find('.calNext').trigger('click')

    await vm.$nextTick()

    expect(vm.year).toBe(2017)
    expect(vm.month).toBe(3)

    $(vm.$el).find('.calPrev').trigger('click')

    await vm.$nextTick()

    expect(vm.year).toBe(2017)
    expect(vm.month).toBe(3)
  })

  it('pick `Today` should do anything', async()=> {
    const vm = mount(DatePicker, {})
    const D = new Date()
    const today = D.getDate()

    expect(vm.value).toBe(`${D.getFullYear()}/${prefix0(D.getMonth() + 1)}/${prefix0(D.getDate())}`)
    $(vm.$el).find(`[data-date="${today}"]`).trigger('click')
    await vm.$nextTick()
    expect(vm.value).toBe(`${D.getFullYear()}/${prefix0(D.getMonth() + 1)}/${prefix0(D.getDate())}`)
  })
})
