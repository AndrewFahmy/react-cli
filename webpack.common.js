const path = require('path'),
    cssParsingPlugin = require('mini-css-extract-plugin'),
    jsPlugin = require('terser-webpack-plugin'),
    cssOptimizationPlugin = require('optimize-css-assets-webpack-plugin'),
    htmlPlugin = require('html-webpack-plugin'),
    progressPlugin = require('simple-progress-webpack-plugin'),
    cliColor = require('cli-color'),
    files = require('./helpers/files'),
    config = require('./helpers/config'),
    webpack = require('webpack');

function generate(env) {

    process.env.NODE_ENV = env;
    const replacements = config.parseFileReplacements(env);

    return {
        mode: env,
        entry: './src/main',
        output: {
            path: path.resolve(files.getCurrentDirectoryBase(), 'dist'),
            filename: '[name]_[contenthash:8].js',
            publicPath: '/'
        },
        optimization: {
            minimizer: [new jsPlugin(), new cssOptimizationPlugin()],
            splitChunks: {
                chunks: 'all',
                filename: '[name]_[contenthash:8].js'
            }
        },
        resolve: {
            modules: [
                'node_modules',
                path.resolve(files.getCurrentDirectoryBase(), 'src')
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: [require.resolve("@babel/preset-env"), require.resolve("@babel/preset-react")],
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent:
                                                    '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                            },
                                        },
                                    },
                                ],
                            ],
                            // This is a feature of `babel-loader` for webpack (not Babel itself).
                            // It enables caching results in ./node_modules/.cache/babel-loader/
                            // directory for faster rebuilds.
                            cacheDirectory: true,
                            // See #6846 for context on why cacheCompression is disabled
                            cacheCompression: false,
                            compact: env !== 'development'
                        }
                    }
                },
                {
                    test: /.s?css$/,
                    use: [cssParsingPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')]
                },
                {
                    test: /\.(png|jpeg|jpg|svg|gif)$/,
                    use: [
                        {
                            loader: require.resolve('file-loader'),
                            options: {
                                outputPath: 'images',
                                name: '[name]_[contenthash:8].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: require.resolve('file-loader'),
                            options: {
                                outputPath: 'fonts',
                                name: '[name]_[contenthash:8].[ext]'
                            }
                        }
                    ]
                },
                ...replacements
            ]
        },
        plugins: [
            function () {
                this.plugin("done", function (stats) {
                    if (stats.compilation.errors && stats.compilation.errors.length) {
                        console.error(cliColor.red(stats.compilation.errors));
                        process.exit(1);
                    }
                });
            },
            new progressPlugin(),

            new cssParsingPlugin({
                filename: 'styles_[contenthash:8].css',
                chunkFilename: 'styles_[contenthash:8].css'
            }),

            new htmlPlugin({
                template: './src/index.html',
                filename: 'index.html'
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            })
        ]
    }
}


module.exports = generate;