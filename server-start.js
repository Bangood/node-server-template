/**
 * Created by pure on 2017/8/30.
 */
require('babel-register');
require('babel-polyfill');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const app = require('./server').default;
const config = require('./config/config').default;
const logger = require('./config/logger').default;
const pkg = require('./package.json');
const nconf = require('nconf');
let configFile = path.join(__dirname, '/config.json');
nconf.argv().env({
  separator: '__',
  lowerCase: true
});
let configExists = fs.existsSync(configFile) || (nconf.get('url') && nconf.get('secret') && nconf.get('database'));

if (nconf.get('config')) {
  logger.info('config');
  configFile = path.resolve(__dirname, nconf.get('config'));
}
loadConfig();
if (!process.send) {
  logger.info('Node Server v' + nconf.get('version') + ' Copyright (C) 2013-' + (new Date()).getFullYear() + ' Bangood Inc.');
  logger.info('This program comes with ABSOLUTELY NO WARRANTY.');
  logger.info('This is free software, and you are welcome to redistribute it under certain conditions.');
  logger.info('');
}
if (nconf.get('setup') || nconf.get('install')) {
  logger.verbose('setup......');
  setup();
} else if (!configExists) {
  require('./install/web').install(nconf.get('port'));
} else {

  if (module.parent) {
    module.exports = app;
  } else {
    app.listen(config.port, () => {
      logger.info(`server started on port ${config.port} (${config.env})`);
    });
  }
}
function loadConfig() {
  logger.verbose(`* using configuration stored in: ${configFile} `);
  nconf.file({
    file: configFile
  });
  nconf.defaults({
    base_dir: __dirname,
    themses_path: path.join(__dirname, 'node_modules'),
    upload_path: 'public/uploads',
    views_dir: path.join(__dirname, 'build/public/templates'),
    version: pkg.version
  });
}
function setup() {
  logger.info('Node server Setup Triggerd via Command Line');
  let install = require('./install').default;
  process.stdout.write('\nWelcome to NodeBB!\n');
  process.stdout.write('\nThis looks like a new installation, so you\'ll have to answer a few questions about your environment before we can proceed.\n');
  process.stdout.write('Press enter to accept the default setting (shown in brackets).\n');
  console.log(install.setup);
  Promise.reduce([install.setup()], (total, value) => {
    return 10;
  }, 0).then((total) => {
    logger.verbose(total);
  });
}
