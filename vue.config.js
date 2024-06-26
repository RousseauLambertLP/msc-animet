const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  publicPath: process.env.BASE_URL,
  transpileDependencies: true,
  chainWebpack: (config) => {
    // ensure index.html is not minified
    config.plugin("html").tap((args) => {
      args[0].minify = false;
      return args;
    });
  },
  configureWebpack: {
    devtool: "source-map",
    plugins: [new NodePolyfillPlugin()],
    resolve: {
      fallback: {
        fs: false,
        os: false,
        path: false,
      },
    },
  },
});
