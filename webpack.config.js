const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'fews-web-oc-utils',
    libraryTarget: 'umd',
    filename: 'fews-web-oc-utils.umd.js',
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