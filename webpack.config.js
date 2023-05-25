const path = require("path")

module.exports = {
  // development, production, none
  mode: "development",
  entry: "index.js",
  output: {
    path: path.resolve(__dirname, "server/public"),
    publicPath: "/",
    filename: "bundle.js",
  },
  target: "web",
  devtool: "source-map",
  devServer: {
    port: "3000",
    static: ["./server/public"],
    open: true,
    hot: true,
    liveReload: true,
    proxy: {
      "/api/*": {
        target: "http://localhost:3333",
        secure: false,
      },
      "/asset/*": {
        target: "http://localhost:3333",
        secure: false,
      },
      "/**": {
        target: "http://localhost:3333",
        secure: false,
      },
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(pdf|zip)$/i,
        loader: "file-loader",
        options: {},
      },
      {
        test: /\.(css|scss|sass)$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpe?g|png|gif|svg|webp)$/i,
        type: "asset/resource",
      },
    ],
  },
}
