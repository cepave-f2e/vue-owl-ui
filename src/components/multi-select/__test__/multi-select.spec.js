import MultiSelect from '../'


it('test <MultiSelect /> with props `options`, `selectedOpts`, `displayKey`, and `isDisabled`', () => {
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { value: 'Winnie the Pooh', id: 26 },
    { value: 'pikachu', id: 24 },
  ]
  const vm = shallow({
    render(h) {
      return (
        <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} isDisabled />
      )
    }
  })
  expect(vm.displayIdx).toEqual([0, 1, 2])
  expect(vm.labels).toEqual([
    { value: 'Piglet', id: 23 },
    { value: 'Winnie the Pooh', id: 26 },
  ])
  $(vm.$el.children[0]).trigger('click')
  expect(vm.disable).toBe(true)
  expect(vm.opened).toBe(false)
})

it('test <MultiSelect /> dynamic change props `selectedOpts`, `isOpened`, `isDisabled`, `loading` and `options`', async() => {
  let vm
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { value: 'Winnie the Pooh', id: 26 },
    { value: 'pikachu', id: 24 },
  ]
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          selectedItems: [0, 1],
          open: false,
          disable: true,
          loading: true,
          options: []
        }
      },
      mounted() {
        this.selectedItems = [2]
        this.open = true
        this.disable = false
        this.loading = false
        this.$nextTick(done)
        this.options = pokemon
      },
      render(h) {
        return (
          <MultiSelect displayKey="value" 
                       selectedOpts={this.selectedItems} 
                       options={this.options} 
                       isOpened={this.open} 
                       isDisabled={this.disable}
                       loading={this.loading} />
        )
      }
    })
  })
  expect(vm.displayIdx).toEqual([0, 1, 2])
  expect(vm.labels).toEqual([
    { value: 'pikachu', id: 24 }
  ])
  expect(vm.opened).toBe(true)
  expect(vm.disable).toBe(false)
  expect(vm.loading).toBe(false)
})

it('test <MultiSelect /> search feature', async() => {
  let vm
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { value: 'Winnie the Pooh', id: 26 },
    { value: 'raticate', id: 18 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    //toggleMenu
    $(vm.$el.children[0]).trigger('click')
    //input
    $(vm.$el.children[0].children[1]).val('ca')
    //trigger keydown ENTER
    vm.handleInput()
    vm.$nextTick(done)
  })
  expect(vm.displayIdx).toEqual([2])
})

it('test <MultiSelect /> case insensitive search', async() => {
  let vm
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Caterpie', id: 23 },
    { value: 'raticate', id: 26 },
    { value: 'Raticate', id: 18 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} caseInsensitive />
        )
      }
    })
    //toggleMenu
    $(vm.$el.children[0]).trigger('click')
    //input
    $(vm.$el.children[0].children[1]).val('ra')
    //trigger keydown ENTER
    vm.handleInput()
    vm.$nextTick(done)
  })
  expect(vm.displayIdx).toEqual([1, 2])
})

it('test <MultiSelect /> select and unselect feature', async() => {
  let vm
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { title: 'Raticate', value: 'raticate', id: 18 },
    { value: 'pikachu', id: 24 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    vm.$nextTick(done)
  })
  $(vm.$el).find(`[data-role="select-option"]`).eq(1).trigger('click')
  $(vm.$el).find(`[data-role="select-option"]`).eq(2).trigger('click')
  expect(vm.selectedIdx).toEqual([0, 2])
})

it('test <MultiSelect /> mouse event', async() => {
  let vm
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { title: 'Raticate', value: 'raticate', id: 18 },
    { value: 'pikachu', id: 24 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    vm.$nextTick(done)
  })
  $(vm.$el.children[1]).trigger('mouseenter')
  expect(vm.optionsHovered).toBe(true)
  $(vm.$el.children[1]).trigger('mouseleave')
  expect(vm.optionsHovered).toBe(false)
  $(vm.$el.children[1].children[1]).trigger('mouseover')
  expect(vm.optionsHovered).toBe(true)
})

it('test <MultiSelect /> keyboard event', async() => {
  let vm
  const selectedItems = [1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { title: 'Raticate', value: 'raticate', id: 18 },
    { value: 'pikachu', id: 24 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    vm.$nextTick(done)
  })

  const key40 = new window.KeyboardEvent('keydown', { keyCode: 40, which: 40 })
  const key38 = new window.KeyboardEvent('keydown', { keyCode: 38, which: 38 })
  const key13 = new window.KeyboardEvent('keydown', { keyCode: 13, which: 13 })

  await new Promise((done) => {
    vm.$el.children[0].children[1].dispatchEvent(key40)
    vm.$nextTick(done)
  })

  expect(vm.optionsHovered).toBe(false)
  expect(vm.focusedIdx).toBe(0)

  await new Promise((done) => {
    vm.$el.children[0].children[1].dispatchEvent(key40)
    vm.$nextTick(done)
  })

  expect(vm.optionsHovered).toBe(false)
  expect(vm.focusedIdx).toBe(1)

  await new Promise((done) => { //unselect
    vm.$el.children[0].children[1].dispatchEvent(key13)
    vm.$nextTick(done)
  })

  expect(vm.selectedIdx).toEqual([])

  await new Promise((done) => {
    vm.$el.children[0].children[1].dispatchEvent(key38)
    vm.$nextTick(done)
  })

  expect(vm.optionsHovered).toBe(false)
  expect(vm.focusedIdx).toBe(0)

  await new Promise((done) => { //select
    vm.$el.children[0].children[1].dispatchEvent(key13)
    vm.$nextTick(done)
  })

  expect(vm.selectedIdx).toEqual([0])

  $(vm.$el.children[1]).trigger('mousemove')
  expect(vm.disablePointer).toBe(false)
})

it('test <MultiSelect /> delete Label by clicking', async() => {
  let vm
  const selectedItems = [0, 1]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { value: 'raticate', id: 18 },
    { value: 'pikachu', id: 24 },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    vm.$nextTick(done)
  })
  $(vm.$el.children[0].children[0].children[0]).trigger('click')
  expect(vm.selectedIdx).toEqual([1])
})

it('test <MultiSelect /> delete Label by backspace', async() => {
  let vm
  const selectedItems = [2, 1, 0]
  const pokemon = [
    { value: 'Piglet', id: 23 },
    { value: 'raticate', id: 18 },
    { value: 'pikachu', id: 24 },
  ]

  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <MultiSelect displayKey="value" selectedOpts={selectedItems} options={pokemon} />
        )
      }
    })
    vm.$nextTick(done)
  })

  const key8 = new window.KeyboardEvent('keydown', { keyCode: 8, which: 8 })

  await new Promise((done) => {
    vm.$el.children[0].children[1].dispatchEvent(key8)
    vm.$nextTick(done)
  })

  expect(vm.focusedLabelIdx).toBe(selectedItems.length - 1)

  await new Promise((done) => {
    vm.$el.children[0].children[1].dispatchEvent(key8)
    vm.$nextTick(done)
  })

  expect(vm.selectedIdx).toEqual([2, 1])
  expect(vm.focusedLabelIdx).toBe(-1)
})
