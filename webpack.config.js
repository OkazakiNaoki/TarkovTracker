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
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        loader: "file-loader",
        options: {},
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
}
