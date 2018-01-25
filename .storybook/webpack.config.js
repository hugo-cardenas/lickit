// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

// TODO Remove config duplication

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // plugins: [
  //   new HtmlWebpackPlugin({
  //       template: './src/template/index.html',
  //       filename: 'index.html',
  //       inject: false
  //   })
  // ],
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.styl$/,
            use: ['style-loader', 'css-loader', 'stylus-loader']
        }
    ]
},
};
