const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'fews-pi-requests',
    libraryTarget: 'umd',
    filename: 'fews-pi-requests.umd.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        // Include ts, tsx, and js files.
        test: /\.(tsx?)|(js)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
}