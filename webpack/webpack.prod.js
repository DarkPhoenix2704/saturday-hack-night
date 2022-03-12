const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const {InjectManifest} = require("workbox-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(),
        ,
        new InjectManifest({
            swSrc: path.resolve(__dirname, "..", "web/sw.ts"),
            exclude: [ /\.map$/, /^manifest.*\.js(?:on)?$/, /\.(jpe?g|png|webp)$/i ],
            maximumFileSizeToCacheInBytes: 13*1024*1024

        })
    ]
};
