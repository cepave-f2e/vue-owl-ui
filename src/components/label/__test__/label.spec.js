import Label from '../'

it('test default <Label>', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label>Default</Label>
      )
    },
  })
  expect(vm.style[0]).toContain('label')
})

it('test <Label> with props `typ` and `status`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label typ="outline" status="primary">Primary</Label>
      )
    },
  })
  expect(vm.style[0]).toContain('label')
  expect(vm.style[1]).toContain('outline')
  expect(vm.style[2]).toContain('primary')
})

it('test <Label> with props `badge`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label badge={true} typ="outline" status="primary">Primary</Label>
      )
    },
  })
  expect(vm.style[0]).toContain('label')
  expect(vm.style[1]).toContain('outline')
  expect(vm.style[2]).toContain('primary')
  expect(vm.style[3]).toContain('badge')
})

it('test <Label> with props `x`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label badge x status="primary">Primary</Label>
      )
    },
  })
  expect(vm.style[4]).toContain('x')
  expect(vm.style[5]).toContain('primarylabelx')
})

it('test clicking on <Label> with props `x`', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Label badge x status="primary">Primary</Label>
        )
      },
    })
    $(vm.$children[0].$el).trigger('click')
    vm.$nextTick(done)
  })
  // expect to destroy vm.$el here, but it still exists
})

it('test <Label.Group> when clicking on <Label>', async() => {
  let vm
  const handleLabelGroup = (data) => {
    expect(data).toEqual([
      { value: 'tigger', id: 2 },
    ])
  }
  const handleRemove = (data) => {
    expect(data).toEqual([
      { value: 'piglet', id: 1 },
    ])
  }
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          test: [
            { value: 'piglet', id: 1 },
            { value: 'tigger', id: 2 },
          ],
        }
      },
      render(h) {
        return (
          <Label.Group displayKey="value" x={true} badge={true} options={this.test} onChange={handleLabelGroup} onRemove={handleRemove} />
        )
      },
    })
    // click on piglet
    $(vm.$children[0].$children[0].$el).trigger('click')
    vm.$nextTick(done)
  })
})

it('test <Label.Group> dynamic update', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          test: [
            { value: 'piglet', id: 1 },
            { value: 'tigger', id: 2 },
          ],
          focusedId: 0,
        }
      },
      mounted() {
        this.test = [
          { value: 'tigger', id: 2 },
        ],
          this.focusedId = 1
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Label.Group displayKey="value" x={true} badge={true} options={this.test} focused={this.focusedId} />
        )
      },
    })
  })
  expect(vm.labelData).toEqual([
    { value: 'tigger', id: 2 },
  ])
  expect(vm.focusedLabel).toBe(1)
})

test('test <Label.Group /> new tag feature', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          test: [
            { value: 'piglet', id: 1 },
            { value: 'tigger', id: 2 },
          ],
        }
      },
      render(h) {
        return (
          <Label.Group displayKey="value"
                       x={true}
                       badge={true}
                       options={this.test}
                       newTag={true}
          />
        )
      },
    })
    expect(vm.newTag).toBe(true)
    $(vm.$children[2].$el).trigger('click')
    vm.$nextTick(done)
  })

  const $newTagInput = $(vm.$el).find('.newTagInput')
  const key13 = new window.KeyboardEvent('keydown', { keyCode: 13, which: 13 })

  function triggerKey13(val = '') {
    return new Promise((done) => {
      $newTagInput.val(val)
      $newTagInput[0].dispatchEvent(key13)

      vm.$nextTick(done)
    })
  }

  await triggerKey13('cepave')
  expect(vm.labelData).toEqual([
    { value: 'piglet', id: 1 },
    { value: 'tigger', id: 2 },
    { value: 'cepave' },
  ])

  await triggerKey13('tigger')
  expect(vm.labelData).toEqual([
    { value: 'piglet', id: 1 },
    { value: 'tigger', id: 2 },
    { value: 'cepave' },
  ])

  // input empty string
  await triggerKey13('')
  expect(vm.labelData).toEqual([
    { value: 'piglet', id: 1 },
    { value: 'tigger', id: 2 },
    { value: 'cepave' },
  ])

  await new Promise((done) => {
    $newTagInput.trigger('blur')
    vm.$nextTick(done)
  })

  expect(vm.showInput).toBe(false)
})
