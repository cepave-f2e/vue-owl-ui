import ComplexQuery from '../'

describe('<ComplexQuery />', () => {
  it('render component', () => {
    const vm = mount(ComplexQuery, {
      categories: [],
    })

    expect(vm).toBeTruthy()
  })

  it('Checkd one item', (done) => {
    const vm = mount(ComplexQuery, {
      categories: [
        {
          name: 'cat1',
          value: 'cat1',
        },
      ],
      loading: true,
      items: [
        {
          name: 'cat1',
          children: [
            {
              name: 'cat1-item1',
              value: 'cat1-item1',
            },
          ],
        },
      ],
    })

    vm.$on('change', ({ selectedItems }) => {
      expect(selectedItems['cat1-item1']).toBeTruthy()
      done()
    })

    $(vm.$el).find('.itemCheckbox').trigger('click')
  })

  it('Switch category: no category', async(done) => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [],
    })

    vm.$on('query', (d) => {
      expect(d).toEqual({
        value: '', category: 'cat1',
      })

      done()
    })
    const keyEnter = new window.KeyboardEvent('keyup', { keyCode: 13, which: 13 })
    vm.$refs.query.dispatchEvent(keyEnter)
  })

  it('Switch category: switch to `cat2`', async(done) => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [],
    })

    vm.$on('query', (d) => {
      expect(d).toEqual({
        value: '', category: 'cat2',
      })

      done()
    })

    const keyEnter = new window.KeyboardEvent('keyup', { keyCode: 13, which: 13 })

    $(vm.$el).find('.categories li').eq(1).trigger('click')
    vm.$refs.query.dispatchEvent(keyEnter)
  })

  it('select/clear all', async() => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [
        {
          name: 'cat 1',
          children: [
            { value: 'cat1 - item1' },
            { value: 'cat1 - item2' },
          ],
        },
      ],
    })

    vm.selectAll()
    expect(Object.keys(vm.storeSelectedItems).length).toBe(2)

    vm.clearAll()
    expect(Object.keys(vm.storeSelectedItems).length).toBe(2)
    vm.items[0].children.forEach((child) => {
      expect(child.checked).toBe(false)
    })

    vm.editRemoveAll()
    expect(vm.storeSelectedItems).toEqual({})
  })

  it('go to edit mode', async() => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [
        {
          name: 'cat 1',
          children: [
            { value: 'cat1 - item1' },
            { value: 'cat1 - item2' },
          ],
        },
      ],
    })
    const $el = $(vm.$el)
    vm.selectAll()
    expect(Object.keys(vm.storeSelectedItems).length).toBe(2)

    await vm.editItems()

    expect($el.find('.editItems .editItemLi').length).toBe(2)

    $el.find('.editItems .editItemLi').eq(1).trigger('click')
    expect(Object.keys(vm.storeSelectedItems).length).toBe(1)
  })

  it('highlight text', async() => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [
        {
          name: 'cat 1',
          children: [
            { name: 'cat1 - item1' },
            { name: 'cat1 - item2' },
          ],
        },
      ],
    })

    const keyEnter = new window.KeyboardEvent('keyup', { keyCode: 13, which: 13 })
    vm.$refs.query.value = 'item2'
    await vm.$refs.query.dispatchEvent(keyEnter)

    expect($(vm.$el).find('.itemView .highlight').length).toBe(1)
  })

  it('test `focus` and `blur`', async() => {
    const vm = mount(ComplexQuery, {})

    vm.handleFocus()
    expect(vm.focus).toBe(true)

    vm.handleBlur()
    expect(vm.focus).toBe(false)
  })

  it('hancleSelect item', async() => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [
        {
          name: 'cat 1',
          children: [
            { value: 'cat1 - item1' },
            { value: 'cat1 - item2' },
          ],
        },
      ],
    })

    $(vm.$el).find('.itemView dt .itemViewCheckbox').trigger('click')

    vm.items[0].children.forEach((child) => {
      expect(child.checked).toBe(true)
    })
  })

  it('`lockBlur`', async() => {
    const vm = mount(ComplexQuery, {})

    $(vm.$el).trigger('mouseenter')
    expect(vm.lockBlur).toBe(true)

    $(vm.$el).trigger('mouseleave')
    expect(vm.lockBlur).toBe(false)
  })

  it('from edit back to normal', async() => {
    const vm = mount(ComplexQuery, {})
    vm.isEdit = true

    expect(vm.isEdit).toBe(true)
    $(vm.$el).find('.backTo').trigger('click')
    expect(vm.isEdit).toBe(false)
  })

  it('test handle fold', async() => {
    const vm = mount(ComplexQuery, {
      categories: [
        { name: 'cat1', value: 'cat1' },
        { name: 'cat2', value: 'cat2' },
      ],
      items: [
        {
          name: 'cat 1',
          children: [
            { value: 'cat1 - item1' },
            { value: 'cat1 - item2' },
          ],
        },
      ],
    })
    const $el = $(vm.$el)
    expect($el.find('.itemView dl').hasClass('isFold')).toBe(false)

    await $el.find('dt').trigger('click')
    expect($el.find('.itemView dl').hasClass('isFold')).toBe(true)
  })
})
