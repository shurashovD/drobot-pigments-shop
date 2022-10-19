const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const mode = process.env.NODE_ENV || 'development'
const output = process.env.NODE_ENV === 'production' ? {
    assetModuleFilename: 'assets/[name][contenthash][ext][query]',
    path: path.resolve(__dirname, '..', 'dist', 'static', 'site'),
    filename: '[name].[contenthash].js',
    publicPath: '/static/site/',
    clean: true
} : {}

module.exports = {
    name: 'site',
    entry: path.join(__dirname, 'index.tsx'),
    devtool: 'inline-source-map',
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        historyApiFallback: true,
        open: true,
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000',
                secure: false,
                changeOrigin: true
            },
            '/static/**': {
                target: 'http://localhost:3000/',
                secure: false,
                changeOrigin: true
            }
        },
        static: true,
    },
    mode: 'development',
    output,
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: './tsconfig.json'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.join(__dirname, 'index.html'), inject: 'body' })
    ]
}