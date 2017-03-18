import Select from '../'
import s from '../select.scss'

it('Test Select component default `options` props', () => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', },
    { value: '5d', title: '5 days', },
  ]
  const vm = mount(Select, {
    options
  })

  expect(vm.value).toBe('1d')
})

it('Test Select component if set `selected` in options', () => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', selected: true },
    { value: '5d', title: '5 days', },
  ]
  const vm = mount(Select, {
    options
  })

  expect(vm.value).toBe('3d')
})

it('Test Select component dynamic update `options`', (done) => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', },
  ]
  const vm = mount(Select, { options })

  vm.options = [
    ...vm.options,
    { value: '5d', title: '5 days', selected: true },
  ]

  vm.$nextTick(() => {
    expect(vm.options.length).toBe(3)
    expect(vm.value).toBe('5d')
    done()
  })
})

it('Test `optionsRender` props', () => {
  const options = [
    {
      value: '1d',
      title: '1 day',
    },
  ]

  const vm = shallow({
    render(h) {
      return (
        <Select options={options} optionsRender={({ option }) => (
          <b>{option.title}</b>
        )} />
      )
    }
  })

  expect($(vm.$el).find(`.${s.optionBox} b`).length).toBe(1)
})

it('Test toggle Select', () => {
  const options = [
    {
      value: '1d',
      title: '1 day',
    },
  ]

  const vm = mount(Select, { options })

  expect(vm.opened).toBe(false)
  $(vm.$el).find(`.${s.selectTitle}`).trigger('click')
  expect(vm.opened).toBe(true)
})

it('Test toggle Select with `isDisabled` ', () => {
  const options = [
    {
      value: '1d',
      title: '1 day',
    },
  ]

  const vm = mount(Select, { options, isDisabled: true })
  expect(vm.opened).toBe(false)
  $(vm.$el).find(`.${s.selectTitle}`).trigger('click')
  expect(vm.opened).toBe(false)
})

it('Test Select blur should be triggered `close`', () => {
  const options = [
    {
      value: '1d',
      title: '1 day',
    },
  ]

  const vm = mount(Select, { options })

  expect(vm.opened).toBe(false)
  $(vm.$el).find(`.${s.selectTitle}`).trigger('click')
  expect(vm.opened).toBe(true)
  $(vm.$el).trigger('blur')
  expect(vm.opened).toBe(false)
})

it('Test dynamic `isOpened` props', (done) => {
  const options = [
    {
      value: '1d',
      title: '1 day',
    },
  ]

  const vm = mount(Select, {
    isOpened: false,
    options
  })

  vm.isOpened = true

  vm.$nextTick(() => {
    expect(vm.opened).toBe(true)
    done()
  })
})

it('Test trigger `onChange`', () => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', },
  ]
  const vm = mount(Select, {
    options
  })
  const $el = $(vm.$el)
  expect(vm.value).toBe('1d')
  $el.find(`.${s.optionBox} [data-role="select-option"]`).eq(1).trigger('click')
  expect(vm.value).toBe('3d')
})

it('Test trigger `onChange `if click same as last selected index', () => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', },
  ]

  const vm = mount(Select, {
    options
  })

  expect(vm.value).toBe('1d')
  $(vm.$el).find(`.${s.optionBox} [data-role="select-option"]`).eq(0).trigger('click')
  expect(vm.value).toBe('1d')
})

it('Test `onChange` props', async() => {
  const options = [
    { value: '1d', title: '1 day', },
    { value: '3d', title: '3 days', },
  ]

  const d = await new Promise((done) => {
    const vm = mount(Select, {
      options,
    })

    vm.$on('change', done)

    $(vm.$el).find(`.${s.optionBox} [data-role="select-option"]`).eq(1).trigger('click')
  })

  expect(d).toEqual({ value: '3d', index: 1 })
})
