const merge = require('webpack-merge'),
    configFactory = require('./webpack.common'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

function generate(env) {
    if (!env) env = 'production';

    const config = configFactory(env);

    config.plugins.unshift(new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["*.*"]
    }));

    return merge(config, {
        devtool: "source-map",
    });
}


module.exports = generate;