var webpack = require('webpack');
var path = require('path');

var Dotenv = require('dotenv-webpack');

var ENV = process.env.NODE_ENV;
var FRONTEND_ENTRY = path.join(__dirname, 'frontend/index.js');

var valueForEnv = function(developmentValue, productionValue) {
    return ENV === 'development' ? developmentValue : productionValue;
}

module.exports = {
    mode: ENV || 'development',
    entry: valueForEnv([
            'react-hot-loader/patch', 
            FRONTEND_ENTRY
        ], [FRONTEND_ENTRY]),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jp(e*)g|gif|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: valueForEnv(undefined, 8000),
                        name: '/img/[hash].[ext]'
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    plugins: valueForEnv([
            new webpack.HotModuleReplacementPlugin(), new Dotenv()
        ], [ new Dotenv() ]),
    devServer: valueForEnv({
        contentBase: path.join(__dirname, 'public'),
        hot: true
    }, {})
};
