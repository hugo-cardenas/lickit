const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');

module.exports = merge(baseConfig, {
    devServer: {
        hot: true,
        port: 3000,
        stats: 'minimal'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
