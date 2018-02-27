const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/js/index.js',
    portfolio: './src/js/portfolio.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
            {
                test:/\.(s*)css$/,
                use:['style-loader','css-loader', 'sass-loader']
             }
     ]
  },
  watch:true,
  resolve: { extensions: [".js", ".ts"] },
  plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            inject: 'head',
            template: './src/index.html',
            chunks: ['index'],
            filename: './index.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            hash: true,
            // inject: 'head',
            template: './src/portfolio.html',
            chunks: ['portfolio'],
            filename: './portfolio.html' //relative to root of the application
        })
   ]
}
