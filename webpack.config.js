const CopyWebpackPlugin = require('copy-webpack-plugin');

const Dotenv = require('dotenv-webpack');

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
          include: /example/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                [ '@babel/plugin-transform-react-jsx' ]
              ]
            }
          }
        },
        {
          test: /\.m?js$/,
          exclude: /example|node_modules/,
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
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
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
  } else {
    config.plugins.push(new Dotenv());
  }

  return config;
};