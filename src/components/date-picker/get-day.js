module.exports = (year, month) => {
  const lastDate = new Date(year, month, 0)
  const firstDate = new Date(year, month - 1, 1)

  return {
    lastDate: lastDate.getDate(),
    firstDay: firstDate.getDay()
  }
}
