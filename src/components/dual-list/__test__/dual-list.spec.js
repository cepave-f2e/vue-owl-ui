import DualList from '../'

it('test dualList with props `items` and `onChange`', async() => {
  const pokemon = [
    { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' }, { name: 'Pikachu', id: '4' },
  ]
  const getData = (data) => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} onChange={getData} displayKey="name" />
        )
      },
    })
    expect(vm.listToAdd).toEqual({
      0: { name: 'Squirtle', id: '1' },
      1: { name: 'Caterpie', id: '2' },
      2: { name: 'Raichu', id: '3' },
      3: { name: 'Pikachu', id: '4' },
    })
    expect(vm.leftList).toEqual({
      0: { name: 'Squirtle', id: '1' },
      1: { name: 'Caterpie', id: '2' },
      2: { name: 'Raichu', id: '3' },
      3: { name: 'Pikachu', id: '4' },
    })
    vm.$nextTick(done)
  })
  // click on 2: 'Raichu'
  $(vm.$children[6].$el).trigger('click')
  expect(vm.leftList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.listToAdd).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.rightList).toEqual({
    2: { name: 'Raichu', id: '3' },
  })
  expect(vm.listToRemove).toEqual({
    2: { name: 'Raichu', id: '3' },
  })
})

it('test dualList with props `selectedItems` and without `items`', async() => {
  const pokemon = [
    { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
  ]
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList selectedItems={pokemon} displayKey="name" />
        )
      },
    })
    expect(vm.listToRemove).toEqual({
      0: { name: 'Squirtle', id: '1' },
      1: { name: 'Caterpie', id: '2' },
    })
    expect(vm.rightList).toEqual({
      0: { name: 'Squirtle', id: '1' },
      1: { name: 'Caterpie', id: '2' },
    })
    expect(vm.listToAdd).toEqual({})
    expect(vm.leftList).toEqual({})
    vm.$nextTick(done)
  })
  // click on 2 again: 'Raichu'
  $(vm.$children[5].$el).trigger('click')
  expect(vm.listToRemove).toEqual({
    0: { name: 'Squirtle', id: '1' },
  })
  expect(vm.rightList).toEqual({
    0: { name: 'Squirtle', id: '1' },
  })
  expect(vm.listToAdd).toEqual({
    1: { name: 'Caterpie', id: '2' },
  })
  expect(vm.leftList).toEqual({
    1: { name: 'Caterpie', id: '2' },
  })
})

it('test search feature', async() => {
  const pokemon = [
    { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' }, { name: 'Pikachu', id: '4' },
  ]
  const getData = (data) => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} onChange={getData} displayKey="name" />
        )
      },
    })
    // search leftList
    vm.$refs.searchListToAdd.value = 'chu'
    $(vm.$refs.searchListToAdd.$el).val('chu')

    const e = { charCode: 13 }
    vm.handleSearchListLeft(e)// $(vm.$children[0].$el).trigger('keypress', e) is not effective
    expect(vm.listToAdd).toEqual({
      2: { name: 'Raichu', id: '3' },
      3: { name: 'Pikachu', id: '4' },
    })
    expect(vm.highlightLeft).toBe('chu')
    vm.$nextTick(done)
  })
  // click on selectAll
  $(vm.$children[1].$el).trigger('click')
  expect(vm.leftList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
  })
  expect(vm.listToAdd).toEqual({})
  expect(vm.rightList).toEqual({
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.listToRemove).toEqual({
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })

  // clickOnX
  vm.handleClickOnX('left')// $(vm.$children[0].$children[1].$el).trigger('click') is not effective
  expect(vm.listToAdd).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
  })
  expect(vm.highlightLeft).toBe('')

  // search rightList
  vm.$refs.searchListToRemove.value = 'Rai'
  $(vm.$refs.searchListToRemove.$el).val('Rai')

  const e = { charCode: 13 }
  vm.handleSearchListRight(e)
  expect(vm.listToRemove).toEqual({
    2: { name: 'Raichu', id: '3' },
  })
  expect(vm.highlightRight).toBe('Rai')

  // click on unSelectAll
  $(vm.$children[2].$el).trigger('click')
  expect(vm.rightList).toEqual({
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.listToRemove).toEqual({})
  expect(vm.leftList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
  })
  expect(vm.listToAdd).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
  })

  // clickOnX
  vm.handleClickOnX('right')
  expect(vm.listToRemove).toEqual({
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.highlightRight).toBe('')
})

it('test search feature with props `caseInsensitive`', () => {
  const pokemonLeft = [
    { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' }, { name: 'Raticate', id: '4' },
  ]
  const pokemonRight = [
    { name: 'Pikachu', id: '10' }, { name: 'Vulpix', id: '11' },
    { name: 'Dodrio', id: '12' },
  ]
  const vm = shallow({
    render(h) {
      return (
        <DualList items={pokemonLeft} selectedItems={pokemonRight} displayKey="name" caseInsensitive />
      )
    },
  })
  // search leftList
  vm.$refs.searchListToAdd.value = 'ca'
  $(vm.$refs.searchListToAdd.$el).val('ca')

  const e = { charCode: 13 }
  vm.handleSearchListLeft(e)// $(vm.$children[0].$el).trigger('keypress', e) is not effective
  expect(vm.listToAdd).toEqual({
    1: { name: 'Caterpie', id: '2' },
    3: { name: 'Raticate', id: '4' },
  })
  expect(vm.highlightLeft).toBe('ca')
  // search rightList
  vm.$refs.searchListToRemove.value = 'pi'
  $(vm.$refs.searchListToRemove.$el).val('pi')

  const f = { charCode: 13 }
  vm.handleSearchListRight(f)
  expect(vm.listToRemove).toEqual({
    4: { name: 'Pikachu', id: '10' },
    5: { name: 'Vulpix', id: '11' },
  })
  expect(vm.highlightRight).toBe('pi')
})

it('test apiMode props `items` and `selectedItems` dynamic change', async() => {
  const getInputValue = (data) => {}
  const removeInput = () => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          pokemon: [
            { name: 'Squirtle', id: '1' },
            { name: 'Caterpie', id: '2' },
            { name: 'Raichu', id: '3' },
            { name: 'Pikachu', id: '4' },
          ],
          selectedPokemon: [
            { name: 'Vulpix', id: '11' },
            { name: 'Dodrio', id: '12' },
          ],
        }
      },
      mounted() {
        this.pokemon = [
          { name: 'Squirtle', id: '1' },
          { name: 'Caterpie', id: '2' },
        ]
        this.selectedPokemon = [
          { name: 'Vulpix', id: '11' },
        ]
        this.$nextTick(done)
      },
      render(h) {
        return (
          <DualList apiMode items={this.pokemon} selectedItems={this.selectedPokemon} onInputchange={getInputValue} onRemove={removeInput} leftLoading={true} displayKey="name" />
        )
      },
    })
  })
  expect(vm.listToAdd).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
  })
  expect(vm.leftList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
  })
  expect(vm.listToRemove).toEqual({
    2: { name: 'Vulpix', id: '11' },
  })
  expect(vm.rightList).toEqual({
    2: { name: 'Vulpix', id: '11' },
  })
})

it('test apiMode `<Input />` event', async() => {
  let vm
  const pokemon = [
    { name: 'Squirtle', id: '1' },
    { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' },
    { name: 'Pikachu', id: '4' },
  ]
  const getInputValue = (data) => {
    expect(data).toBe('chu')
  }
  const removeInput = () => {}
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList apiMode items={pokemon} onInputchange={getInputValue} onRemove={removeInput} leftLoading={true} displayKey="name" />
        )
      },
    })
    // search leftList
    vm.$refs.searchListToAdd.value = 'chu'
    $(vm.$refs.searchListToAdd.$el).val('chu')

    const e = { charCode: 13 }
    vm.handleSearchListLeft(e)
    vm.$nextTick(done)
  })
  // clickOnX
  vm.handleClickOnX('left')
})

it('test selectAll feature', async() => {
  let vm
  const pokemon = [
    { name: 'Squirtle', id: '1' },
    { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' },
    { name: 'Pikachu', id: '4' },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} displayKey="name" />
        )
      },
    })
    // selectAll
    $(vm.$children[1].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.listToRemove).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.rightList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })
})

it('test unSelectAll feature', async() => {
  let vm
  const pokemon = [
    { name: 'Squirtle', id: '1' },
    { name: 'Caterpie', id: '2' },
    { name: 'Raichu', id: '3' },
    { name: 'Pikachu', id: '4' },
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList selectedItems={pokemon} displayKey="name" />
        )
      },
    })
    // unSelectAll
    $(vm.$children[2].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.listToAdd).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })
  expect(vm.leftList).toEqual({
    0: { name: 'Squirtle', id: '1' },
    1: { name: 'Caterpie', id: '2' },
    2: { name: 'Raichu', id: '3' },
    3: { name: 'Pikachu', id: '4' },
  })
})
