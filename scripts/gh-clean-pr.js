require('shelljs/global')
const { repo } = require('./deploy')

const commit = exec(`git log --pretty=format:"%s" -1`, {
  silent: true
}).stdout

const prBranch = /^Merge pull request #\d+ from cepave-f2e\/(.+)/.test(commit) && RegExp.$1

if (prBranch) {
  exec(`git push ${repo} ${prBranch} --delete`)
}
