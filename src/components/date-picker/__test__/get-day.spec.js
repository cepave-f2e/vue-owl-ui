import getLastDay from '../get-day'

it('2016/2', () => {
  expect(getLastDay(2016, 2)).toEqual({
    firstDay: 1,
    lastDate: 29
  })
})

it('2017/1', () => {
  expect(getLastDay(2017, 1)).toEqual({
    firstDay: 0,
    lastDate: 31
  })
})
it('2017/2', () => {
  expect(getLastDay(2017, 2)).toEqual({
    firstDay: 3,
    lastDate: 28
  })
})

it('2017/3', () => {
  expect(getLastDay(2017, 3)).toEqual({
    firstDay: 3,
    lastDate: 31
  })
})

it('2017/4', () => {
  expect(getLastDay(2017, 4)).toEqual({
    firstDay: 6,
    lastDate: 30
  })
})

it('2017/5', () => {
  expect(getLastDay(2017, 5)).toEqual({
    firstDay: 1,
    lastDate: 31
  })
})

it('2017/6', () => {
  expect(getLastDay(2017, 6)).toEqual({
    firstDay: 4,
    lastDate: 30
  })
})

it('2017/7', () => {
  expect(getLastDay(2017, 7)).toEqual({
    firstDay: 6,
    lastDate: 31
  })
})

it('2017/8', () => {
  expect(getLastDay(2017, 8)).toEqual({
    firstDay: 2,
    lastDate: 31
  })
})

it('2017/9', () => {
  expect(getLastDay(2017, 9)).toEqual({
    firstDay: 5,
    lastDate: 30
  })
})

it('2017/10', () => {
  expect(getLastDay(2017, 10)).toEqual({
    firstDay: 0,
    lastDate: 31
  })
})

it('2017/11', () => {
  expect(getLastDay(2017, 11)).toEqual({
    firstDay: 3,
    lastDate: 30
  })
})

it('2017/12', () => {
  expect(getLastDay(2017, 12)).toEqual({
    firstDay: 5,
    lastDate: 31
  })
})
