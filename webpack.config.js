var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {

  const mode = argv.mode || 'development';

  const config = {
    mode,
    entry: './example/src/index.js',
    output: {
      filename: 'dist/index.js',
      path: __dirname + '/example'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                [ '@babel/plugin-transform-react-jsx', {
                  'importSource': '@bpmn-io/properties-panel/preact',
                  'runtime': 'automatic'
                } ]
              ]
            }
          }
        },
        {
          test: /\.bpmn$/,
          use: {
            loader: 'raw-loader'
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: './node_modules/bpmn-js/dist/assets', to: 'dist/vendor/bpmn-js/assets' },
          { from: './node_modules/bpmn-js-properties-panel/dist/assets', to: 'dist/vendor/bpmn-js-properties-panel/assets' }
        ]
      })
    ]
  };

  if (mode === 'production') {
    config.devtool = 'source-map';
  }

  return config;
};