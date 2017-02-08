import prefix0 from '../prefix0'

it('should be prefixed 0 if length < 2', ()=> {
  expect(prefix0(1)).toBe('01')
  expect(prefix0('2')).toBe('02')
})

it('donnot prefix', ()=> {
  expect(prefix0(87)).toBe('87')
  expect(prefix0(8.7)).toBe('8.7')
  expect(prefix0(.7)).toBe('0.7')
})
