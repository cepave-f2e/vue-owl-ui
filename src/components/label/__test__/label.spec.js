import Label from '../'

it('test default <Label>', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label>Default</Label>
      )
    }
  })
  expect(vm.style[0]).toContain('label')
})

it('test <Label> with props `typ` and `status`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label typ="outline" status="primary">Primary</Label>
      )
    }
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
    }
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
    }
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
      }
    })
    $(vm.$children[0].$el).trigger('click')
    vm.$nextTick(done)
  })
  //expect to destroy vm.$el here, but it still exists
})

it('test <Label.Group> when clicking on <Label>', async() => {
  let vm
  const handleLabelGroup = (data) => {
    expect(data).toEqual([
      { value: 'tigger', title: 'Tigger' }
    ])
  }
  const handleRemove = (data) => {
    expect(data).toEqual([
      { value: 'piglet', title: 'Piglet' }
    ])
  }
  await new Promise((done) => {
    vm = shallow({
      data() {
        return {
          test: [
            { value: 'piglet', title: 'Piglet' },
            { value: 'tigger', title: 'Tigger' }
          ]
        }
      },
      render(h) {
        return (
          <Label.Group x={true} badge={true} options={this.test} onChange={handleLabelGroup} onRemove={handleRemove} />
        )
      }
    })
    //click on piglet
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
            { value: 'piglet', title: 'Piglet' },
            { value: 'tigger', title: 'Tigger' }
          ]
        }
      },
      mounted() {
        this.test = [
          { value: 'tigger', title: 'Tigger' }
        ]
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Label.Group x={true} badge={true} options={this.test} />
        )
      }
    })
  })
  expect(vm.labelData).toEqual([
    { value: 'tigger', title: 'Tigger' }
  ])
})
