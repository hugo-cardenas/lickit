const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
    devServer: {
        contentBase: 'build',
        hot: true,
        port: 3000,
        stats: 'minimal'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'electron-main'
});
