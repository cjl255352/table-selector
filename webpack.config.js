const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.js",
  output: {
    filename: "table-selector.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    library: {
      name: "tableSelector",
      type: "umd",
    },
  },
  optimization: {},
  devtool: isProduction ? "nosources-source-map" : "eval-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()].concat(isProduction ? [new MiniCssExtractPlugin()] : []),
};
