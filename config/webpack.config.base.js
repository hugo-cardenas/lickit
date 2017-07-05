const { join } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './src/index.js',
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
        filename: '[name].js',
        path: join(__dirname, '../dist')
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/template/index.html',
            filename: 'index.html',
            inject: false
        })
    ],
    target: 'electron-main'
};
