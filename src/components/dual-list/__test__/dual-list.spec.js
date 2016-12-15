import DualList from '../'

it('test dualList with props `items` and `onChange`', async() => {
  const pokemon = [
    'Squirtle',
    'Caterpie',
    'Raichu',
    'Pikachu'
  ]
  const getData = (data) => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} onChange={getData} />
        )
      }
    })
    expect(vm.listToAdd).toEqual({
      0: 'Squirtle',
      1: 'Caterpie',
      2: 'Raichu',
      3: 'Pikachu',
    })
    expect(vm.leftList).toEqual({
      0: 'Squirtle',
      1: 'Caterpie',
      2: 'Raichu',
      3: 'Pikachu',
    })
    vm.$nextTick(done)
  })
  //click on 2: 'Raichu'
  $(vm.$children[6].$el).trigger('click')
  expect(vm.leftList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    3: 'Pikachu',
  })
  expect(vm.listToAdd).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    3: 'Pikachu',
  })
  expect(vm.rightList).toEqual({
    2: 'Raichu'
  })
  expect(vm.listToRemove).toEqual({
    2: 'Raichu'
  })
})

it('test dualList with props `selectedItems` and without `items`', async() => {
  const pokemon = [
    'Squirtle',
    'Caterpie'
  ]
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList selectedItems={pokemon} />
        )
      }
    })
    expect(vm.listToRemove).toEqual({
      0: 'Squirtle',
      1: 'Caterpie'
    })
    expect(vm.rightList).toEqual({
      0: 'Squirtle',
      1: 'Caterpie'
    })
    expect(vm.listToAdd).toEqual({})
    expect(vm.leftList).toEqual({})
    vm.$nextTick(done)
  })
  // click on 2 again: 'Raichu'
  $(vm.$children[5].$el).trigger('click')
  expect(vm.listToRemove).toEqual({
    0: 'Squirtle'
  })
  expect(vm.rightList).toEqual({
    0: 'Squirtle'
  })
  expect(vm.listToAdd).toEqual({
    1: 'Caterpie'
  })
  expect(vm.leftList).toEqual({
    1: 'Caterpie'
  })
})

it('test search feature', async() => {
  const pokemon = [
    'Squirtle',
    'Caterpie',
    'Raichu',
    'Pikachu'
  ]
  const getData = (data) => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} onChange={getData} />
        )
      }
    })
    //search leftList
    vm.$refs.searchListToAdd.value = 'chu'
    $(vm.$refs.searchListToAdd.$el).val('chu')

    const e = { charCode: 13 }
    vm.handleSearchListLeft(e)// $(vm.$children[0].$el).trigger('keypress', e) is not effective
    expect(vm.listToAdd).toEqual({
      2: 'Raichu',
      3: 'Pikachu'
    })
    expect(vm.highlightLeft).toBe('chu')
    vm.$nextTick(done)
  })
  //click on selectAll
  $(vm.$children[1].$el).trigger('click')
  expect(vm.leftList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie'
  })
  expect(vm.listToAdd).toEqual({})
  expect(vm.rightList).toEqual({
    2: 'Raichu',
    3: 'Pikachu',
  })
  expect(vm.listToRemove).toEqual({
    2: 'Raichu',
    3: 'Pikachu',
  })

  //clickOnX
  vm.handleClickOnX('left')// $(vm.$children[0].$children[1].$el).trigger('click') is not effective
  expect(vm.listToAdd).toEqual({
    0: 'Squirtle',
    1: 'Caterpie'
  })
  expect(vm.highlightLeft).toBe('')

  //search rightList
  vm.$refs.searchListToRemove.value = 'Rai'
  $(vm.$refs.searchListToRemove.$el).val('Rai')

  const e = { charCode: 13 }
  vm.handleSearchListRight(e)
  expect(vm.listToRemove).toEqual({
    2: 'Raichu'
  })
  expect(vm.highlightRight).toBe('Rai')

  //click on unSelectAll
  $(vm.$children[2].$el).trigger('click')
  expect(vm.rightList).toEqual({
    3: 'Pikachu'
  })
  expect(vm.listToRemove).toEqual({})
  expect(vm.leftList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu'
  })
  expect(vm.listToAdd).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu'
  })

  //clickOnX
  vm.handleClickOnX('right')
  expect(vm.listToRemove).toEqual({
    3: 'Pikachu'
  })
  expect(vm.highlightRight).toBe('')
})

it('test apiMode props `items` dynamic change', async() => {
  const getInputValue = (data) => {}
  const removeInput = () => {}
  let vm
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          pokemon: [
            'Squirtle',
            'Caterpie',
            'Raichu',
            'Pikachu',
          ]
        }
      },
      mounted() {
        this.pokemon = [
          'Squirtle',
          'Caterpie'
        ]
        this.$nextTick(done)
      },
      render(h) {
        return (
          <DualList apiMode items={this.pokemon} onInputchange={getInputValue} onRemove={removeInput} leftLoading={true} />
        )
      }
    })
  })
  expect(vm.listToAdd).toEqual({
    0: 'Squirtle',
    1: 'Caterpie'
  })
  expect(vm.leftList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie'
  })
})

it('test apiMode `<Input />` event', async() => {
  let vm
  const pokemon = [
    'Squirtle',
    'Caterpie',
    'Raichu',
    'Pikachu',
  ]
  const getInputValue = (data) => {
    expect(data).toBe('chu')
  }
  const removeInput = () => {}
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList apiMode items={pokemon} onInputchange={getInputValue} onRemove={removeInput} leftLoading={true} />
        )
      }
    })
    //search leftList
    vm.$refs.searchListToAdd.value = 'chu'
    $(vm.$refs.searchListToAdd.$el).val('chu')

    const e = { charCode: 13 }
    vm.handleSearchListLeft(e)
    vm.$nextTick(done)
  })
  //clickOnX
  vm.handleClickOnX('left')
})

it('test selectAll feature', async() => {
  let vm
  const pokemon = [
    'Squirtle',
    'Caterpie',
    'Raichu',
    'Pikachu',
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList items={pokemon} />
        )
      }
    })
    //selectAll
    $(vm.$children[1].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.listToRemove).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu',
    3: 'Pikachu'
  })
  expect(vm.rightList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu',
    3: 'Pikachu'
  })
})

it('test unSelectAll feature', async() => {
  let vm
  const pokemon = [
    'Squirtle',
    'Caterpie',
    'Raichu',
    'Pikachu',
  ]
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <DualList selectedItems={pokemon} />
        )
      }
    })
    //unSelectAll
    $(vm.$children[2].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.listToAdd).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu',
    3: 'Pikachu'
  })
  expect(vm.leftList).toEqual({
    0: 'Squirtle',
    1: 'Caterpie',
    2: 'Raichu',
    3: 'Pikachu'
  })
})
