const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, ''),
    mode: "production",
    entry: {
        main: './index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'qwertyGrammar',
            type: 'var',
        },
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            // worker: "./src/app.worker.js"
        }),
        new CleanWebpackPlugin(),
        new NodemonPlugin(),
    ],
    devServer: {
        port: 4200,
        hot: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.worker\.js$/,
            //     use: ['worker-loader']
            // }
        ]
    },


}