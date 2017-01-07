import { ver, repo } from './deploy'
import 'shelljs/global'

cd('npm')
exec(`git init`)
exec(`git remote add origin ${repo}`)
exec(`git add .`)
exec(`git commit -anm "${ver}"`)
exec(`git checkout -b ${ver}`)
exec(`git push origin ${ver}`)
