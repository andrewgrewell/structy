const path = require('path');


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'structy.js',
        library: 'structy',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, './src'),
            exclude: /node_modules/,
            options: {
                cacheDirectory: true,
                presets: [
                    require('babel-plugin-transform-es2015-modules-commonjs'),
                    [require.resolve('babel-preset-es2015'), { 'modules': false }],
                    require.resolve('babel-preset-stage-2')
                ]
            }
        }]
    }
};