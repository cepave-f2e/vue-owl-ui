import { exec } from 'child_process'
import { version, repository } from '../package.json'

const ver = `v${version}`

exec(`cd npm && 
git init && 
git remote add origin ${repository.url.replace(/^git\+/, '')} && 
git add . && 
git commit -anm "${ver}" &&
git checkout -b ${ver} &&
git push origin ${ver}`, (err, stdout) => {
  if (err) {
    return console.log(err)
  }

  console.log(stdout)
})
