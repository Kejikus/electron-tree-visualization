path = require('path');


module.exports = {
    mode: 'development',
    entry: {
        app: './src/renderer/app.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]'
    },
    target: 'electron-renderer',

    devtool: 'source-map',

    resolve: {
        extensions: ['.js', '.tsx', '.ts', ".sass", '.scss'],
        modules: [
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-typescript',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { loose: false }],
                    ]
                }
            },
            {
                test: /\.s[a|c]ss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /.js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            },
            {
                test: /\.txt/,
                use: {
                    loader: 'raw-loader'
                }
            }
            // {
            //     test: /\.s[a|c]ss$/,
            //     use: [
            //         {
            //             loader: "style-loader"
            //         },
            //         {
            //             loader: "css-loader"
            //         },
            //         {
            //             loader: "sass-loader",
            //             options: {
            //                 includePaths: [
            //                     path.resolve(__dirname, "./src/sass"),
            //                     path.resolve(__dirname, "./node_modules/materialize-css/sass")
            //                 ]
            //             }
            //         }
            //     ],
            // }
        ]
    },
};