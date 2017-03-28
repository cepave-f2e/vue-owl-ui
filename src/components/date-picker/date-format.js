import prefix0 from '../time-picker/prefix0'

module.exports = (Date = new Date(), fmt = '') => {
  return fmt.replace(/(y|m|d)+/ig, (m) => {
    m = m.toLocaleLowerCase()

    if (m.startsWith('y')) {
      return String(Date.getFullYear()).substr(0 - m.length)
    }

    let md
    if (m.startsWith('m')) {
      md = Date.getMonth() + 1
    }

    if (m.startsWith('d')) {
      md = Date.getDate()
    }

    return (m.length > 1)
      ? prefix0(md)
      : md
  })
}
