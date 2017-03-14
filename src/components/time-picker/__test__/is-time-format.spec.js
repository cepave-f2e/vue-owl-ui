import isTimeFormat from '../is-time-format'

it('Should be a valid time format', ()=> {
  expect(isTimeFormat('00:15')).toBe(true)
  expect(isTimeFormat('00:30')).toBe(true)
})

it('Should be throw error if the hour is greater 23', ()=> {
  expect(()=> {
    isTimeFormat('24:00')
  }).toThrow()
})

it('Should be throw error if the minute is greater 59', ()=> {
  expect(()=> {
    isTimeFormat('23:60')
  }).toThrow()
})

it('Should not be a valid time format', ()=> {
  expect(()=> {
    isTimeFormat('000:15')
  }).toThrow(/is not a valid time format/)
})
