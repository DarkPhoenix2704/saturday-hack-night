const path = require("path");
const packageJSON = require("../package.json");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CopyPlugin = require("copy-webpack-plugin");

const buildFolder = path.resolve(__dirname, "..", "./public");

module.exports = (env) => ({
    entry: path.resolve(__dirname, "..", "./web/react/index.tsx"),
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            include: path.resolve(__dirname, "..", "./web")
                        }
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|webp)$/i,
                use: [
                    {
                        loader: "responsive-loader",
                        options: {
                            adapter: require("responsive-loader/sharp")
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(?:ico|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: "asset/inline",
            },
        ],
    },
    output: {
        path: buildFolder,
        publicPath: "/",
        filename: "bundle.[contenthash].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "./web/index.html"),
            title: packageJSON.name,
            favicon: path.resolve(__dirname, "..", "./web/assets/icons/favicon.ico"),
            meta: {
                author: packageJSON.author,
                description: packageJSON.description,
                keyword: packageJSON.keyword,
                "theme-color": packageJSON["theme-color"]
            }
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "..", "web/assets/fallbacks/offline.html"),
            filename: "offline.html",
            title: "Offline",
            inject: false
        }),
        new WebpackPwaManifest({
            name: packageJSON.name,
            short_name: packageJSON.name,
            description: packageJSON.description,
            background_color: packageJSON["background-color"],
            orientation: "any",
            theme_color: packageJSON["theme-color"],
            publicPath: "/",
            icons: [
                {
                    src: path.resolve(__dirname, "..", "web/assets/icons/logo512.png"),
                    sizes: [96, 128, 192, 256, 384, 512]
                }
            ]
        }),
        new CopyPlugin({
            patterns: [
                path.resolve(__dirname, "..", "web/robots.txt"),
            ],
        })
    ],
    stats: "errors-only"
});
