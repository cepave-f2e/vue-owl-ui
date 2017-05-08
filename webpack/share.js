module.exports = {
  hotPort: 3032,
  loaders: {
    css: {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader?modules&localIdentName=[name]_[local]&sourceMap',
        'sass-loader?sourceMap'
      ]
    }
  }
}
