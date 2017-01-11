const { tag, repo } = require('./deploy')
reqiure('shelljs/global')

exec(`git tag ${tag}`)
exec(`git push ${repo} ${tag}`)
