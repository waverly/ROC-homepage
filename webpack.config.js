const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
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
            filename: './index.html' //relative to root of the application
        })
   ]
}
