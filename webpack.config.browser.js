const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        "app": "./src/index.js"
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index-bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.svg$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      limit: 10000,
                    },
                  },
                ],
              },
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ]
};