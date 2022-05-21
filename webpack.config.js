const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
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
  devtool: isProduction ? "nosources-source-map" : "eval-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
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
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, "public/index.html") }),
    new ESLintPlugin({ context: path.resolve(__dirname, "src") }),
  ].concat(isProduction ? [new MiniCssExtractPlugin()] : []),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
