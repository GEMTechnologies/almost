const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Granada NGO Management System'
    })
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api/ai': 'http://localhost:8001',
      '/api/finance': 'http://localhost:8002',
      '/api/grants': 'http://localhost:8003',
      '/api/projects': 'http://localhost:8004'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};