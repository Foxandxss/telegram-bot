module.exports = {
  entry: './src/bot.ts',
  target: 'node',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bot.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  }
}
