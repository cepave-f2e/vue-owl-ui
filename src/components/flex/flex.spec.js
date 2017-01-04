import Flex from './'

it('test size=2 and size=auto', () => {
  const vm = shallow({
    render(h) {
      return (
        <Flex>
          <Flex.Col size="2" />
          <Flex.Col size="auto" />
        </Flex>
      )
    }
  })
  expect(vm.$children.length).toBe(2)
})

it('test offset', () => {
  const vm = shallow({
    render(h) {
      return (
        <Flex>
          <Flex.Col offset="6" />
        </Flex>
      )
    }
  })
  expect(vm.$el.innerHTML.includes('margin-left: 50%')).toBe(true)
})

it('Test `grids=12` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Flex grids={12}>
          <Flex.Col size="6" />
          <Flex.Col size="6" />
        </Flex>
      )
    }
  })
  expect(vm.$el.innerHTML.match(/width: 50%;/g), 2)
})

it('Test `grids=24` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Flex grids={24}>
          <Flex.Col size="12" />
          <Flex.Col size="12" />
        </Flex>
      )
    }
  })
  expect(vm.$el.innerHTML.match(/width: 50%;/g), 2)
})
