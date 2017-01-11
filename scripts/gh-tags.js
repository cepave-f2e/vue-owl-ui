const { tag, repo } = require('./deploy')
require('shelljs/global')

exec(`git tag ${tag}`)
exec(`git push ${repo} ${tag}`)
