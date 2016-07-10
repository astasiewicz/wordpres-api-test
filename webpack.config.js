const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/index.js',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: 'jshint-loader',
            exclude: /node_modules/
        }],
        loaders: [{
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize')
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'file',
            include: path.join(__dirname, 'app', 'img'),
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?name=images/[name].[ext]?[sha512:hash:base64:7]&limit=20000',
            include: path.join(__dirname, 'app', 'css', 'img'),
        }]
    },
    devtool: 'source-map',
    devServer: {
        hot: true,
        inline: true,
        contentBase: './dist',
        historyApiFallback: true,
        progress: true
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
