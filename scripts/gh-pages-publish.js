import 'shelljs/global'
import pkg, { repository, version }from '../package.json'

cd('gh-pages')

exec('git init')
exec(`git remote add origin ${repository}`)
exec('git add .')
exec(`git checkout -b gh-pages`)
exec(`git commit -anm '${version}'`)
exec(`git push origin gh-pages -f`)
