const timeRE = /^\d\d:\d\d$/
const throwErr = (time = '') => {
  if (timeRE.test(time)) {
    let [hh, mm] = time.split(':')
    hh = +hh
    mm = +mm

    if (hh > 23) {
      throw new Error(`${hh} is greater than 23`)
    }

    if (mm > 59) {
      throw new Error(`${mm} is greater than 59`)
    }

    return true
  }

  throw new Error(`${time} is not a valid time format. It should be \`hh:mm\``)
}

module.exports = throwErr
