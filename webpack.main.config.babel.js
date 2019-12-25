path = require('path');
webpack = require('webpack');


module.exports = {
    mode: 'development',
    target: 'electron-main',
    entry: {
        main: './src/main/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]'
    },

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
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript']
                    }
                },
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
};