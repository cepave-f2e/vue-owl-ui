import dateFormat from '../date-format'

const D = new Date(2017, 3 - 1, 2)

describe('Test Date Format', () => {
  it('Convert format with prefix 0', () => {
    expect(dateFormat(D, 'yyyy/mm/dd')).toBe('2017/03/02')
    expect(dateFormat(D, 'yyyy-mm-dd')).toBe('2017-03-02')
    expect(dateFormat(D, 'dd/mm/yyyy')).toBe('02/03/2017')
  })

  it('test format `yy/m/d`', () => {
    expect(dateFormat(D, 'yy/m/d')).toBe('17/3/2')
  })
})
