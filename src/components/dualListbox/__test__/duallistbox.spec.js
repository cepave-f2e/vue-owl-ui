import Dual from '../'

it('test dualListBox with props `items` and `onChange`', async() => {
  const pokemon = {
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu',
    4: 'Pikachu',
  }
  const getData = (data) => {
    // console.log(data);
  }
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Dual.Group items={pokemon} onChange={getData} />
        )
      }
    })
    expect(vm.listToAdd).toEqual({
      1: 'Squirtle',
      2: 'Caterpie',
      3: 'Raichu',
      4: 'Pikachu',
    })
    expect(vm.leftList).toEqual({
      1: 'Squirtle',
      2: 'Caterpie',
      3: 'Raichu',
      4: 'Pikachu',
    })
    //click on 3: 'ctl-jx-059-063-188-146'
    $(vm.$children[3].$el).trigger('click')
    expect(vm.leftList).toEqual({
      1: 'Squirtle',
      2: 'Caterpie',
      4: 'Pikachu',
    })
    expect(vm.listToAdd).toEqual({
      1: 'Squirtle',
      2: 'Caterpie',
      4: 'Pikachu',
    })
    expect(vm.rightList).toEqual({
      3: 'Raichu'
    })
    expect(vm.listToRemove).toEqual({
      3: 'Raichu'
    })
    vm.$nextTick(done)
  })
  //click on 3 again: 'Raichu'
  $(vm.$children[7].$el).trigger('click')
  expect(vm.leftList).toEqual({
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu',
    4: 'Pikachu',
  })
  expect(vm.listToAdd).toEqual({
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu',
    4: 'Pikachu',
  })
  expect(vm.rightList).toEqual({})
  expect(vm.listToRemove).toEqual({})
})

it('test dualListBox with props `selectedItems` and without `items`', () => {
  const pokemon = {
    1: 'Squirtle',
    2: 'Caterpie'
  }
  const vm = shallow({
    render(h) {
      return (
        <Dual.Group selectedItems={pokemon} />
      )
    }
  })
  expect(vm.listToRemove).toEqual({
    1: 'Squirtle',
    2: 'Caterpie'
  })
  expect(vm.rightList).toEqual({
    1: 'Squirtle',
    2: 'Caterpie'
  })
  expect(vm.listToAdd).toEqual({})
  expect(vm.leftList).toEqual({})
})

it('test search features', async() => {
  const pokemon = {
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu',
    4: 'Pikachu',
  }
  const getData = (data) => {
    // console.log(data);
  }
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Dual.Group items={pokemon} onChange={getData} />
        )
      }
    })
    //search leftList
    vm.$refs.searchListToAdd.value = 'chu'
    $(vm.$refs.searchListToAdd.$el).val('chu')

    const e = { charCode: 13 }
    vm.handleSearchListLeft(e)// $(vm.$children[0].$el).trigger('keypress', e) is not effective
    expect(vm.listToAdd).toEqual({
      3: 'Raichu',
      4: 'Pikachu'
    })
    expect(vm.highlightLeft).toBe('chu')
    vm.$nextTick(done)
  })
  // //click on selectAll
  $(vm.$children[3].$el).trigger('click')
  expect(vm.leftList).toEqual({
    1: 'Squirtle',
    2: 'Caterpie'
  })
  expect(vm.listToAdd).toEqual({})
  expect(vm.rightList).toEqual({
    3: 'Raichu',
    4: 'Pikachu',
  })
  expect(vm.listToRemove).toEqual({
    3: 'Raichu',
    4: 'Pikachu',
  })

  //clickOnX
  vm.handleClickOnX('left')// $(vm.$children[0].$children[1].$el).trigger('click') is not effective
  expect(vm.listToAdd).toEqual({
    1: 'Squirtle',
    2: 'Caterpie'
  })
  expect(vm.highlightLeft).toBe('')

  //search rightList
  vm.$refs.searchListToRemove.value = 'Rai'
  $(vm.$refs.searchListToRemove.$el).val('Rai')

  const e = { charCode: 13 }
  vm.handleSearchListRight(e)
  expect(vm.listToRemove).toEqual({
    3: 'Raichu'
  })
  expect(vm.highlightRight).toBe('Rai')

  //click on unSelectAll
  $(vm.$children[4].$el).trigger('click')
  expect(vm.rightList).toEqual({
    4: 'Pikachu'
  })
  expect(vm.listToRemove).toEqual({})
  expect(vm.leftList).toEqual({
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu'
  })
  expect(vm.listToAdd).toEqual({
    1: 'Squirtle',
    2: 'Caterpie',
    3: 'Raichu'
  })

  //clickOnX
  vm.handleClickOnX('right')
  expect(vm.listToRemove).toEqual({
    4: 'Pikachu'
  })
  expect(vm.highlightRight).toBe('')
})
