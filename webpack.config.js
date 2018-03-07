const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js",
    portfolio: "./src/js/portfolio.js",
    about: "./src/js/about.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  watch: true,
  resolve: { extensions: [".js", ".ts"] },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: "head",
      template: "./src/index.html",
      chunks: ["index"],
      filename: "./index.html" //relative to root of the application
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/portfolio.html",
      chunks: ["portfolio"],
      filename: "./portfolio.html" //relative to root of the application
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/about.html",
      chunks: ["about"],
      filename: "./about.html" //relative to root of the application
    })
  ]
};
