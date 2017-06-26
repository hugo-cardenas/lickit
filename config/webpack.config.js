var {join} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({template: './public/index.html', filename: 'index.html', inject: 'body'});

module.exports = {
    devServer: {
        hot: true,
        contentBase: 'build',
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
    plugins: [HtmlWebpackPluginConfig]
};