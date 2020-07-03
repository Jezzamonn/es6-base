const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    },
    stats: {
        colors: true
    },
    mode: 'development'
}

const client = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'build/web/js'),
        filename: 'main.bundle.js'
    },
    devtool: 'source-map'
}

const gifExport = {
    entry: './src/js/save-frames.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'save-frames.bundle.js'
    },
    target: 'node',
    externals: [nodeExternals()]
}

module.exports = [
    Object.assign({}, common, client),
    Object.assign({}, common, gifExport)
];