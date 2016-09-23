module.exports = {
  hotPort: 3032,
  loaders: {
    css: {
      test: /\.scss$/,
      loaders: [
        'style',
        'css?modules&localIdentName=[local]--[hash:base64:5]&sourceMap',
        'sass?sourceMap'
      ]
    }
  }
}
