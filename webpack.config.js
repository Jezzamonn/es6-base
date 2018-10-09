const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const common = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
}

const client = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.bundle.js'
    },
    devtool: 'source-map'
}

const gifExport = {
    entry: './js/gif-gen.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'gif-gen.bundle.js'
    },
    target: 'node',
    externals: [nodeExternals()]
}

module.exports = [
    Object.assign({}, common, client),
    Object.assign({}, common, gifExport)
];