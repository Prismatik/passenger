var webpack = require('webpack');

var context = __dirname + '/src';
var entry = {
  javascript: './app.js',
  html: './index.html'
};
var loaders = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: ['react-hot', 'babel']
  },
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  },
  {
    test: /\.html$/,
    loader: 'file?name=[name].[ext]',
  }
];
var output = {
  filename: 'app.js',
  path: __dirname + '/dist',
};

var environments = {
  development: {
    context: context,
    entry: entry,
    module: {
      loaders: loaders
    },
    output: output,
    devServer: {
      port: 3005
    },
    proxy: {
      '/socket.io*': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  },
  production: {
    devtool: 'cheap-module-source-map',
    context: context,
    entry: entry,
    module: {
      loaders: loaders
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    output: output
  }
};

module.exports = environments[process.env.NODE_ENV] || environments.development;
