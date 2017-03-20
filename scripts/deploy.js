const { version, repository } = require('../package.json')
require('shelljs/global')
const axios = require('axios')
const { TRAVIS_BRANCH, TRAVIS_MATRIX, TRAVIS_PULL_REQUEST_BRANCH,
  GH_TOKEN, NPM_TOKEN, SLACK_TOKEN } = process.env

const tokenRepo = repository.replace(/(github.com)/, `${GH_TOKEN}@$1`)
const tag = `v${version}`

console.log({ TRAVIS_BRANCH, TRAVIS_MATRIX, TRAVIS_PULL_REQUEST_BRANCH })

if (TRAVIS_MATRIX === 'test') {
  exec('curl -s https://codecov.io/bash | bash')

  if (TRAVIS_BRANCH === 'dev') {
    // Clean pr branch
    const commit = exec(`git log --pretty=format:"%s" -1`, {
      silent: true
    }).stdout

    const prBranch = /^Merge pull request #\d+ from cepave-f2e\/(.+)/.test(commit) && RegExp.$1

    if (prBranch) {
      exec(`git push ${tokenRepo} ${prBranch} --delete`)
    }
  }
}

if (TRAVIS_BRANCH === 'master') {
  if (TRAVIS_MATRIX === 'build.ui') {
    // Publish to NPM
    exec(`echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > ~/.npmrc`)
    exec(`npm publish ./npm --access=public`).code && exit(1)

    // Add GH Tag
    exec(`git tag ${tag}`)
    exec(`git push ${tokenRepo} ${tag}`, {
      silent: true,
    })

    axios({
      url: `https://hooks.slack.com/services/${SLACK_TOKEN}`,
      method: 'post',
      data: {
        username: 'Mike',
        icon_emoji: ':mikesay:',
        channel: '#notify-owl-ui',
        text: `
@channel

:star: *owl-ui* \`${tag}\` 上版拉~
:unicorn_face: https://github.com/cepave-f2e/vue-owl-ui/releases/tag/${tag}
`,
      },
    })
      .then((res)=> {
        console.log(res.statusText)
      })
      .catch((er)=> {
        console.log(er.response.status)
      })
  }

  if (TRAVIS_MATRIX === 'build.pages') {
    exec(`git config --global user.email "auto_deploy@circleci.com"`)
    exec(`git config --global user.name "CircleCI"`)

    // Publish to gh-pages
    cd('gh-pages')
    exec('git init')
    exec(`git remote add origin ${tokenRepo}`)
    exec('git add .')
    exec(`git checkout -b gh-pages`)
    exec(`git commit -anm '${version}'`)
    exec(`git push origin gh-pages -f`)
  }
}
