import Select from '../'

it('Test Select component default Props value', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn}>
          <Select.Option>A</Select.Option>
        </Select>
      )
    }
  })

  expect(vm.isOpen).toBe(false)
  expect(vm.isDisable).toBe(false)
  expect(vm.name).toBe('')
  expect(typeof vm.onChange === 'function').toBeTruthy()
})

it('Test Select component handleClick', async() => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn}>
          <Select.Option>A</Select.Option>
          <Select.Option>B</Select.Option>
        </Select>
      )
    }
  })

  vm.toggleMenu()
  await new Promise((done) => {
    vm.$nextTick(done)
  })
  expect(vm.opened).toBe(true)
})

it('Test Select component set props `name`', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B">B</Select.Option>
        </Select>
      )
    }
  })

  expect(vm.name).toBe('selectName')
})

it('Test Select component clicked option', () => {
  const mockFn = (data) => {
    expect(data.value).toBe('B')
    expect(data.idx).toBe(1)
  }

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B">B</Select.Option>
        </Select>
      )
    }
  })

  // Mock mouse clicked event
  const optionItem = vm.$el.children[1].children[1]
  $(optionItem).trigger('click')

  // testing clicked same option
  $(optionItem).trigger('click')
  expect(vm.d.selectedIdx === +optionItem.getAttribute('data-idx')).toBe(true)
})

it('Test Select component blur event', () => {
  const mockFn = (data) => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B">B</Select.Option>
        </Select>
      )
    }
  })

  vm.opened = true

  // Testing blur event
  $(vm.$el).trigger('blur')

  expect(vm.opened).toBe(false)
})

it('Test Select toggle meanu event should be cancel', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName" isDisable={true}>
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B">B</Select.Option>
        </Select>
      )
    }
  })

  vm.toggleMenu()
  expect(vm.isDisable).toBe(true)
  expect(vm.opened).toEqual(false)
})

it('Test Select watch props value `isOpen` should be ture', async() => {
  const mockFn = () => {}
  let vm

  await new Promise((done) => {
    vm = shallow({
      props: {
        isOpen: {
          type: Boolean,
          default: false
        }
      },

      mounted() {
        this.isOpen = true
        this.$nextTick(done)
      },

      render(h) {
        return (
          <Select onChange={mockFn} name="selectName" isOpen={this.isOpen}>
            <Select.Option value="A">A</Select.Option>
            <Select.Option value="B">B</Select.Option>
          </Select>
        )
      }
    })
  })

  expect(vm.opened).toBe(true)
})

it('Test Select should be no slots', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
        </Select>
      )
    }
  })

  expect(vm.$slots.default).toBeUndefined()
})

it('Test Select option props should be default value', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
          <Select.Option>A</Select.Option>
          <Select.Option value="B" selected={true}>B</Select.Option>
        </Select>
      )
    }
  })

  expect(vm.$children[0].selected).toBe(false)
  expect(vm.$children[0].value).toBe('')
  expect(vm.$children[1].selected).toBe(true)
  expect(vm.$children[1].value).toBe('B')
})

it('Test Select option should be selected', () => {
  const mockFn = () => {}

  const vm = shallow({
    render(h) {
      return (
        <Select onChange={mockFn} name="selectName">
          <Select.Option value="A">A</Select.Option>
          <Select.Option value="B" selected={true}>B</Select.Option>
        </Select>
      )
    }
  })
  expect(vm.$slots.default[0].componentOptions.propsData.selected).toBeUndefined()
  expect(vm.$slots.default[1].componentOptions.propsData.selected).toBe(true)
})
