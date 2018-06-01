module.exports = {
  title: 'react-ideal-image',
  components: 'src/components/**/index.js',
  skipComponentsWithoutExample: true,
  assetsDir: 'other/images',
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'prop-types': 'prop-types',
      'react-waypoint': 'react-waypoint',
    },
  },
}
