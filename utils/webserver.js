// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path');

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server = new WebpackDevServer({
  https: false,
  hot: true,
  port: env.PORT,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  devMiddleware: {
    writeToDisk: true
  }
}, compiler);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

const runServer = async () => {
  await server.start(env.PORT);;
};

runServer();
