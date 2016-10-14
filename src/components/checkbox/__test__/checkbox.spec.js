import Checkbox from '../'

it('set <Checkbox> `checked`, and `name` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group>
          <Checkbox name="1" checked={true}>First Element</Checkbox>
          <Checkbox name="2" checked={false}>Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  expect(vm.$children[0].check).toBe(true)
  expect(vm.$children[1].check).toBe(false)
})

it('test <Checkbox.Group> with a Checkbox named `all` and `checked` being true', () => {
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group>
          <Checkbox name="all" checked={true}>All</Checkbox>
          <Checkbox name="1">First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  expect(vm.$children[0].check).toBe(true)
  expect(vm.$children[1].check).toBe(true)
  expect(vm.$children[2].check).toBe(true)
})

it('test Checkbox named `all` and `checked` being true, and then being clicked', () => {
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group>
          <Checkbox name="all" checked={true}>All</Checkbox>
          <Checkbox name="1">First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  $(vm.$children[0].$el).trigger('click')
  expect(vm.$children[0].check).toBe(false)
  expect(vm.$children[1].check).toBe(false)
  expect(vm.$children[2].check).toBe(false)
})

it('test Checkbox named `all` and `checked` being false, and then being clicked', () => {
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group>
          <Checkbox name="all">All</Checkbox>
          <Checkbox name="1">First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  $(vm.$children[0].$el).trigger('click')
  expect(vm.$children[0].check).toBe(true)
  expect(vm.$children[1].check).toBe(true)
  expect(vm.$children[2].check).toBe(true)
})

it('test Checkbox `non-all` elements affect the `all` element', () => {
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group>
          <Checkbox name="all" checked={true}>All</Checkbox>
          <Checkbox name="1">First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  //First Element is clicked
  $(vm.$children[1].$el).trigger('click')
  expect(vm.$children[0].check).toBe(false)
  expect(vm.$children[1].check).toBe(false)
  expect(vm.$children[2].check).toBe(true)

  //First Element is clicked again
  $(vm.$children[1].$el).trigger('click')
  expect(vm.$children[0].check).toBe(true)
  expect(vm.$children[1].check).toBe(true)
  expect(vm.$children[2].check).toBe(true)
})

it('test Checkbox `checked` dynamic updates', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data: {
        input: false
      },
      mounted() {
        this.input = true
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Checkbox.Group>
            <Checkbox name="1" checked={this.input}>First Element</Checkbox>
            <Checkbox name="2">Second Element</Checkbox>
          </Checkbox.Group>
        )
      }
    })
  })
})

it('test <Checkbox> `onChange` props', async() => {
  const getCheckboxData = (data) => {
    expect(data).toEqual({ 1 : false })
  }
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group >
          <Checkbox name="1" checked={true} onChange={getCheckboxData}>First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  //First Element is clicked
  $(vm.$children[0].$el).trigger('click')
  await new Promise((done) => {
    vm.$nextTick(done)
  })
})

it('test <Checkbox.Group> `onChange` props', async() => {
  const getCheckboxData = (data) => {
    expect(data).toEqual({ all : false, 1 : false, 2 : true })
  }
  const vm = shallow({
    render(h) {
      return (
        <Checkbox.Group onChange={getCheckboxData}>
          <Checkbox name="all" checked={true}>All</Checkbox>
          <Checkbox name="1">First Element</Checkbox>
          <Checkbox name="2">Second Element</Checkbox>
        </Checkbox.Group>
      )
    }
  })

  //First Element is clicked
  $(vm.$children[1].$el).trigger('click')
  await new Promise((done) => {
    vm.$nextTick(done)
  })
})
