/* eslint-disable */
const path = require('path');
const { execSync } = require('child_process');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const { NODE_ENV, ANALYZE } = process.env;

const environment = NODE_ENV || 'development';
const isDev = environment === 'development';
const isAnalyzing = ANALYZE === 'true';
const pkgFile = require('./package.json');

const gitRevision = execSync('git rev-parse HEAD').toString().trim();

const { compilerOptions } = require('../../tsconfig.json');

const paths = compilerOptions.paths;
const pathKeys = Object.keys(paths).filter(p => !p.includes('*'));

const getPath = (key) => {
    let p = paths[key][0];
    if (p.endsWith('index')) {
        p = p.slice(0, -5);
    }

    return path.join('..', '..', p);
};

// Alias
const alias = {};
pathKeys.forEach(key => {
    alias[key] = path.resolve(getPath(key));
});

// Routes
const routesConfig = require('./src/config/routes.json');
const routePaths = routesConfig.map(r => r.path);

// Prefix
const assetPrefix = process.env.assetPrefix || '';

module.exports = {
    mode: environment,
    target: isDev ? 'web' : 'browserslist',
    devtool: isDev ? 'source-map' : false,
    devServer: {
        writeToDisk: true,
        port: 3000,
        hot: isDev, // HMR
    },
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx'),
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: `${assetPrefix}/`,
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[id].[contenthash:8].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            'node_modules',
            '../../node_modules',
        ],
        alias,
        fallback: {
            // Polyfills API for NodeJS libraries in the browser
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            process: require.resolve('process'),
            // For Google OAuth library to work
            child_process: false,
            fs: false,
            net: false,
            tls: false,
        },
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                react: {
                    chunks: 'initial',
                    name: 'react',
                    test: /[\\/]node_modules[\\/]react/,
                },
                vendors: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/](?!react)/,
                },
                components: {
                    chunks: 'initial',
                    name: 'components',
                    test: /[\\/]packages[\\/]components[\\/]/,
                },
            },
        },
    },
    performance: {
        maxAssetSize: 10 * 1000 * 1000,
        maxEntrypointSize: 1000 * 1000,
    },
    module: {
        rules: [
            // TypeScript/JavaScript
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            [
                                'babel-plugin-styled-components',
                                {
                                    displayName: true,
                                    preprocess: true,
                                },
                            ],
                            ...(isDev ? ['react-refresh/babel'] : []),
                        ],
                    },
                },
            },
            // Workers
            {
                test: /\.worker.ts$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: 'static/worker.[contenthash].js',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                        },
                    },
                ],
            },
            // Images
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                use: {
                    loader: 'file-loader',
                    options: {
                        // limit: 10000,
                        name: 'static/img/[name].[contenthash:8].[ext]',
                    },
                },
            },
            // CSS
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]__[local]',
                            },
                        },
                    },
                ],
            }
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process',
        }),
        new webpack.DefinePlugin({
            'process.browser': true,
            'process.env': JSON.stringify(process.env),
            'process.env.SUITE_TYPE': JSON.stringify('web'),
            'process.env.VERSION': JSON.stringify(pkgFile.version),
            'process.env.COMMITHASH': JSON.stringify(gitRevision),
            'process.env.assetPrefix': JSON.stringify(assetPrefix),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '..', 'suite-data', 'files'),
                    to: path.join(__dirname, 'build', 'static'),
                },
                {
                    from: path.join(__dirname, 'src', 'static', 'manifest.json'),
                    to: path.join(__dirname, 'build', 'manifest.json'),
                    transform: (content) => content.toString().replace(/\{assetPrefix\}/g, assetPrefix),
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
        // Html files
        ...routePaths.map(r => {
            return new HtmlWebpackPlugin({
                minify: !isDev,
                template: path.join(__dirname, 'src', 'static', 'index.html'),
                templateParameters: {
                    assetPrefix: assetPrefix,
                    isOnionLocation: false, // TODO: Get from flags
                },
                filename: path.join(__dirname, 'build', r, 'index.html'),
            });
        }),
        new HtmlWebpackPlugin({
            minify: !isDev,
            template: path.join(__dirname, 'src', 'static', '404.html'),
            templateParameters: {
                assetPrefix: assetPrefix,
                isOnionLocation: false, // TODO: Get from flags
            },
            filename: path.join(__dirname, 'build', '404.html'),
        }),
        // PWA
        new WorkboxPlugin.GenerateSW({
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true,
            maximumFileSizeToCacheInBytes: 10 * 1000 * 1000,
            /*
            runtimeCaching: [
                {
                    urlPattern: '/(news|connect).trezor.io/',
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                    },
                },
                {
                    urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'image-cache',
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
            ],
            */
        }),

        // Webpack Dev server only
        ...(isDev ? [
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
        ] : []),
        ...(isAnalyzing ? [
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
            }),
        ] : []),
        // new webpack.debug.ProfilingPlugin()
    ],
};
