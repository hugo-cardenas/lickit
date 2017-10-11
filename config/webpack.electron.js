const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');

module.exports = merge(baseConfig, {
    entry: {
        app: './src/app.js'
    }
});
