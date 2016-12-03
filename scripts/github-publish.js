import 'shelljs/global'
import pkg, { version, repository } from '../package.json'

const ver = `v${version}`

cd('npm')
exec(`git init`)
exec(`git remote add origin ${repository}`)
exec(`git add .`)
exec(`git commit -anm "${ver}"`)
exec(`git checkout -b ${ver}`)
exec(`git push origin ${ver}`)
