import Radio from '../'

it('test <Radio> `on` and `name` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Radio.Group>
          <Radio name="1" on={true}>1 year</Radio>
          <Radio name="2">2 year</Radio>
        </Radio.Group>
      )
    }
  })
  expect(vm.$children[0].name).toBe('1')
  expect(vm.$children[1].name).toBe('2')
  expect(vm.$children[0].active).toBe(true)
  expect(vm.$children[1].active).toBe(false)
})

it('test the behavior of switching between <Radio>', () => {
  const vm = shallow({
    render(h) {
      return (
        <Radio.Group>
          <Radio name="1" on={true}>1 year</Radio>
          <Radio name="2">2 year</Radio>
        </Radio.Group>
      )
    }
  })
  $(vm.$children[1].$el).trigger('click')
  expect(vm.$children[0].active).toBe(false)
  expect(vm.$children[1].active).toBe(true)
})

it('test <Radio> `on` dynamic updates', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data: {
        input1: true,
        input2: false,
      },
      mounted() {
        this.input2 = true
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Radio.Group>
            <Radio name="1" on={this.input1}>1 year</Radio>
            <Radio name="2" on={this.input2}>2 year</Radio>
          </Radio.Group>
        )
      }
    })
  })
  expect(vm.$children[0].active).toBe(false)
  expect(vm.$children[1].active).toBe(true)
})

it('test <Radio> `onChange` props', () => {
  const getRadioData = (data) => {
    expect(data).toEqual({ 1: true })
  }
  const vm = shallow({
    render(h) {
      return (
        <Radio.Group>
          <Radio name="1" onChange={getRadioData}>1 year</Radio>
          <Radio name="2">2 year</Radio>
        </Radio.Group>
      )
    }
  })
  $(vm.$children[0].$el).trigger('click')
})

it('test <Radio.Group> `onChange` props', () => {
  const getRadioData = (data) => {
    expect(data).toEqual({ 1: true, 2: false })
  }
  const vm = shallow({
    render(h) {
      return (
        <Radio.Group onChange={getRadioData}>
          <Radio name="1">1 year</Radio>
          <Radio name="2">2 year</Radio>
        </Radio.Group>
      )
    }
  })
  $(vm.$children[0].$el).trigger('click')
})
