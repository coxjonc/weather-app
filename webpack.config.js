var path = require('path')
var webpack = require('webpack')

module.exports = {

    context: __dirname,

    entry: './assets/js/index', 
    
    output: {
        path: path.resolve('./public/'), 
        filename: '[name].js', 
    },
    
    plugins: [
        new webpack.ProvidePlugin({ 
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery' 
        })
    ],
    
    module: {
        loaders: [
            {test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader', 
                query: {
                    presets: ['react'] 
                }
            },
            {test: /\.css$/,
                loader: 'style-loader!css-loader'}
        ]
    },
    
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'] 
    }   
}
