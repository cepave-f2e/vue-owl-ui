import { ver, repo } from './deploy'
import 'shelljs/global'

cd('gh-pages')

exec('git init')
exec(`git remote add origin ${repo}`)
exec('git add .')
exec(`git checkout -b gh-pages`)
exec(`git commit -anm '${ver}'`)
exec(`git push origin gh-pages -f`)
