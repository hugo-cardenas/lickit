const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/index.js',
    },
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
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: '[name].js',
        path: join(__dirname, '../dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template/index.html',
            filename: 'index.html',
            inject: false
        })
    ],
    target: 'electron-main'
};
