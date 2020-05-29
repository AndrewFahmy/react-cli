const merge = require('webpack-merge'),
    commonConfigFactory = require('./webpack.common');


const config = commonConfigFactory('development');

module.exports = merge(config, {
    devtool: "inline-source-map",
    devServer: {
        contentBase: './dist',
        compress: true
    }
});
