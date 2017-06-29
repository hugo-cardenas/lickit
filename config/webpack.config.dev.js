const webpack = require('webpack');
const merge = require('webpack-merge');
const { join } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = {
    entry: [
        './src/index.js'
    ],
    devServer: {
        hot: true,
        port: 3000,
        stats: 'minimal'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: join(__dirname, '../build')
    },
    plugins: [
        new htmlWebpackPlugin({
            chunks: ['bundle'],
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    target: 'electron-main'
};
