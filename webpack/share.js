module.exports = {
  hotPort: 3032,
  loaders: {
    css: {
      test: /\.scss$/,
      loaders: [
        'style-loader',
        'css-loader?modules&localIdentName=[local]--[hash:base64:5]&sourceMap',
        'sass-loader?sourceMap'
      ]
    }
  }
}
