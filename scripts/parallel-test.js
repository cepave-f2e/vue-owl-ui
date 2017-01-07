const { exec } = require('shelljs')

const { CIRCLE_NODE_INDEX } = process.env

console.log({ CIRCLE_NODE_INDEX })

const cmds = [
  'npm run lint',
  'npm test',
  'npm run build',
]

if (cmds[CIRCLE_NODE_INDEX]) {
  console.log(cmds[CIRCLE_NODE_INDEX])
  exec(cmds[CIRCLE_NODE_INDEX])
}
