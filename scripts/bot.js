const axios = require('axios')
const SLACK_TOKEN = 'T04SYQ2DX/B4KST57E0/REV1az2wMtEgRoaj8fY0OefV'
const tag = 'v0.7.9'
require('shelljs/global')

exec('git tag --list', { silent: true }, async (er, tags) => {
  tags = (tags.split('\n'))
  const lastTag = tags[tags.length - 3]

  axios({
    url: `https://hooks.slack.com/services/${SLACK_TOKEN}`,
    method: 'post',
    data: {
      username: `owl-ui`,
      icon_emoji: ':owl-ui:',
      channel: '@rwu',
      text:
        `<!channel>\n\n <https://github.com/cepave-f2e/vue-owl-ui|cepave-f2e/vue-owl-ui> \`${tag}\` is released.\n`,
      attachments: [
        {
          color: '#FF2E9C',
          text: `<https://github.com/cepave-f2e/vue-owl-ui/releases/tag/${tag}|:spiral_note_pad: Release Note>`,
        },
        {
          color: '#00EDFF',
          text: `<https://github.com/cepave-f2e/vue-owl-ui/compare/${lastTag}...${tag}|:bug: Compare Change>`,
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
