const { join } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devServer: {
        contentBase: 'build',
        hot: true,
        https: true,
        port: 3000,
        stats: 'minimal'
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: join(__dirname, '../build')
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
    plugins: [
        new htmlWebpackPlugin({ template: './public/index.html', filename: 'index.html', inject: 'body' }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
