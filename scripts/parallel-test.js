const { exec } = require('shelljs')

const { CIRCLE_NODE_INDEX } = process.env

console.log({ CIRCLE_NODE_INDEX })

if (CIRCLE_NODE_INDEX == 0) {
  exec('npm run lint')
} else if (CIRCLE_NODE_INDEX == 1) {
  exec('npm test')
} else if (CIRCLE_NODE_INDEX == 2) {
  exec('npm run build')
}
