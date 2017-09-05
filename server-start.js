/**
 * Created by pure on 2017/8/30.
 */
require('babel-register');
require('babel-polyfill');

const app = require('./server').default;
const config = require('./config/config').default;
const logger = require('./config/logger').default;
if (module.parent) {
  module.exports = app;
} else {
  app.listen(config.port, () => {
    logger.info(`server started on port ${config.port} (${config.env})`);
  });
}
