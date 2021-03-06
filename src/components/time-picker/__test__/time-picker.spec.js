import TimePicker from '../'

describe('Time Picker', () => {
  it('loop time counts', () => {
    const vm = mount(TimePicker, {
      start: '08:00',
      end: '08:30',
      step: 15,
    })
    expect($(vm.$el).find('li').length).toBe(3)
  })

  it('Dynamic open time picker', (done) => {
    const vm = mount(TimePicker, {
    })

    expect(document.activeElement).toBe(document.body)

    vm.open = true
    vm.$nextTick(() => {
      expect(document.activeElement).toBe(vm.$el)
      done()
    })
  })

  it('Dynamic close time picker', (done) => {
    const vm = mount(TimePicker, {
      open: true,
    })

    expect(document.activeElement).toBe(vm.$el)

    vm.open = false
    vm.$nextTick(() => {
      expect(document.activeElement).toBe(document.body)
      done()
    })
  })

  it('Pick a time and `onChange` emit', (done) => {
    const vm = mount(TimePicker, {
      start: '08:00',
      end: '08:30',
      step: 15,
    })

    vm.$on('change', (data) => {
      expect(data).toEqual({ value: '08:30', h: 8, m: 30 })
      done()
    })

    const $time0830 = $(vm.$el).find('li').eq(2)

    $time0830.trigger('click')

    // pick same time again
    $time0830.trigger('click')
  })

  it('Dynamic set `defaultValue`', async() => {
    const vm = mount(TimePicker, {
      defaultValue: '08:00',
    })
    expect(vm.value).toBe('08:00')
    vm.defaultValue = '09:00'
    await vm.$nextTick()

    expect(vm.value).toBe('09:00')
  })
})
