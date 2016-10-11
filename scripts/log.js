import c from 'chalk'

module.exports = (...args)=> {
  args = [
    c.grey(new Date),
    c.yellow('[owl-ui]'),
    ...args
  ]
  console.log.apply(null, args)
}
