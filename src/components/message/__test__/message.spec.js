import Message from '../'

describe('Message', () => {
  let vm

  beforeEach(() => {
    vm = Message({
      message: 'test',
      duration: 500,
      showClose: true,
      onClose() {},
      iconClass: 'test',
    })
  })

  afterEach(() => {
    const el = document.querySelector('.message')
    if (el) {
      el.parentNode.removeChild(el)
    }
    if (vm) {
      vm.$destroy()
    }
  })

  it('a string as a parameter', () => {
    vm = Message('test')
    expect(vm.$el.textContent).toBe('test')
  })

  it('if message is closed automatically', done => {
    expect(document.querySelector('.message')).not.toBeNull()
    setTimeout(() => {
      expect(document.querySelector('.message')).toBeNull()
      done()
    }, 1000)
  })

  it('closed message manually', done => {
    expect(document.querySelector('.message')).not.toBeNull()
    vm.$el.querySelector('.closeBtn').click()
    setTimeout(() => {
      expect(document.querySelector('.message')).toBeNull()
      done()
    }, 300)
  })

  it('if callback function is triggered after message is closed', done => {
    const mockFn = jest.fn()
    vm.onClose = mockFn
    setTimeout(() => {
      expect(vm.onClose).toHaveBeenCalled()
      done()
    }, 3500)
  })

  it('if clearTimeout is triggered after message is mouseentered', () => {
    expect(vm.timer).not.toBeNull()
    const event = new MouseEvent('mouseenter')
    document.querySelector('.message').dispatchEvent(event)
    expect(vm.timer).toBeNull()
  })

  it('use custom icon if set iconClass to true', () => {
    expect(vm.$el.querySelector('.test')).not.toBeNull()
  })
})
