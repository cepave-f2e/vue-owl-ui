const { loaders } = require('./share')

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      loaders.css,
    ],
  },
}
