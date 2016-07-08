module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "bundle.js"
  },
  watch: true,
   module: {
   preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'

      }
   ]
   //,
   // loaders: [
   //   {
   //     test: /\.es6$/,
   //     exclude: /node_modules/,
   //     loader: 'babel-loader',
   //     query: {
   //        cacheDirectory: true, 
   //        presets: ['react', 'es2015'] 
   //     }
   //    }
   // ]
 }
}