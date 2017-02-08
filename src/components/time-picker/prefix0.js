module.exports = (s = '0') => {
  if (typeof s === 'number') {
    s = String(s)
  }
  if (s.length < 2) {
    return `0${s}`
  }

  return s
}
