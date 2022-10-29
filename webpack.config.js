const path = require("path");
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')
//const mode = process.env.NODE_ENV || 'development'
const mode = 'development'

module.exports = {
    name: 'server',
    entry: {
        server: path.resolve(__dirname, 'server/server.ts')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 9000
    },
    devtool: 'inline-source-map',
    mode,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    externals: [nodeExternals()],
    target: 'node',
    node: {
        __dirname: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.json'
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: 'server/views', to: 'views'
            }]
        })
    ]
}