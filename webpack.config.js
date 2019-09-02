/**
 * webpack 配置
 */

 const path = require('path');

 const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

 const { CleanWebpackPlugin } = require('clean-webpack-plugin');

 module.exports = {
     entry: './src/ts/index.ts',
     output: {
         path: path.resolve(__dirname,'dist'),
         filename: 'screenCapture.js',
         library:{
            root: "ScreenCapture",
            amd: "ScreenCapture",
            commonjs: "ScreenCapture"
          },
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: "default"
     },
     mode:'production',
    //  devtool: 'inline-source-map',
     module: {
         rules: [
            { 
                test: /\.tsx?$/, 
                use:[
                {
                    loader: "ts-loader",
                    options:{

                        configFile: path.join(__dirname,'tsconfig.json')
                    }

                }
            ] },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
         ]
     },
     resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
 }