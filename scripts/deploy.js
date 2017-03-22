const { version, repository, author } = require('../package.json')
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
  const targetMatrix = {
    'build.ui'() {
      // Publish to NPM
      exec(`echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > ~/.npmrc`)
      exec(`npm publish ./npm --access=public`).code && exit(1)

      // Add GH Tag
      exec(`git tag ${tag}`)
      exec(`git push ${tokenRepo} ${tag}`, {
        silent: true,
      })

      exec('git tag --list | sort -V', async(er, tags) => {
        if (er) {
          throw new Error(er)
        }
        tags = (tags.split('\n'))
        const lastTag = tags[tags.length - 3]

        await new Promise((done)=> {
          setTimeout(done, 1000 * 20)
        })

        axios({
          url: `https://hooks.slack.com/services/${SLACK_TOKEN}`,
          method: 'post',
          data: {
            username: 'owl-ui',
            icon_emoji: ':owl-ui:',
            channel: '#notify-owl-ui',
            text:
              `<!channel>\n\n <https://github.com/cepave-f2e/vue-owl-ui|cepave-f2e/vue-owl-ui> \`${tag}\` is released.\n`,
            attachments: [
              {
                color: '#FF2E9C',
                text: `<https://github.com/cepave-f2e/vue-owl-ui/releases/tag/${tag}|:spiral_note_pad: Release Note>`,
              },
              {
                color: '#00EDFF',
                text: `<https://github.com/cepave-f2e/vue-owl-ui/compare/${lastTag}...${tag}|:bug: Compare Changes>`,
              },
              {
                color: '#FFDA00',
                text: `<https://cepave-f2e.github.io/vue-owl-ui|:earth_americas: Live Demo>`,
              },
              {
                footer: '－ Made with :heart: by Cepave F2E Team',
              },
            ],
          },
        })
        .then((res)=> {
          console.log(res.statusText)
        })
        .catch((er)=> {
          console.log(er.response.status)
        })
      })
    },

    'build.pages'() {
      exec(`git config --global user.email "auto_deploy@travis-ci.org"`)
      exec(`git config --global user.name "TravisCI"`)

      // Publish to gh-pages
      cd('gh-pages')
      exec('git init')
      exec('git add .')
      exec(`git commit -anm '${version}'`)
      exec(`git push ${tokenRepo} master:gh-pages -f`)
    }
  }[TRAVIS_MATRIX]

  if (targetMatrix) {
    targetMatrix()
  }
}
