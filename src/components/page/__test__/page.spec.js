import Page from '../'

it('Test `totalPages`', () => {
  let vm
  vm = mount(Page, {
    limit: 10, total: 100,
  })
  expect(vm.totalPages).toBe(10)

  vm = mount(Page, {
    limit: 10, total: 101,
  })
  expect(vm.totalPages).toBe(11)
})

it('Test switch to `next` and `prev`', () => {
  const vm = mount(Page, {
    limit: 10, total: 100,
  })
  expect(vm.page).toBe(1)

  const $el = $(vm.$el)
  $el.find('[data-page="next"]').trigger('click')
  expect(vm.page).toBe(2)

  $el.find('[data-page="prev"]').trigger('click')
  expect(vm.page).toBe(1)
})

it('Test click same page', () => {
  const vm = mount(Page, {
    limit: 10, total: 100,
  })
  expect(vm.page).toBe(1)

  $(vm.$el).find('[data-page="3"]').trigger('click')
  expect(vm.page).toBe(3)

  $(vm.$el).find('[data-page="3"]').trigger('click')
  expect(vm.page).toBe(3)
})

it('Test to last page', () => {
  const vm = mount(Page, {
    limit: 10, total: 100, toPage: 10,
  })
  expect(vm.page).toBe(10)
})

it('Test `number` typ', () => {
  const vm = mount(Page, {
    typ: 'number',
    limit: 10, total: 100,
  })

  expect(vm.$el.textContent).toMatch(/1 of 10/)
})

it('Test dynamic set `toPage`', (done) => {
  const vm = mount(Page, {
    limit: 10, total: 100,
  })

  vm.toPage = 5
  vm.$nextTick(() => {
    expect(vm.page).toBe(5)
    done()
  })
})

it('Test if total pages < limit', () => {
  const vm = mount(Page, {
    limit: 10, total: 5,
  })

  expect($(vm.$el).find('li[data-role="page"]').length).toBe(1)
})
