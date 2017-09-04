/**
 * Created by pure on 2017/9/4.
 */
import nconf from 'nconf';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';
import prompt from 'prompt';
import logger from './config/logger';
const questions = {};
const install = {};
prompt.getAsync = Promise.promisify(prompt.get);
questions.main = [
  {
    name: 'url',
    description: 'URL used to access this NodeBB',
    default: nconf.get('url') ||
    (nconf.get('base_url') ? (nconf.get('base_url') + (nconf.get('use_port') ? ':' + nconf.get('port') : '')) : null) ||
    'http://localhost:4567',
    pattern: /^http(?:s)?:\/\//,
    message: 'Base URL must begin with \'http://\' or \'https://\''
  },
  {
    name: 'secret',
    description: 'Please enter a NodeBB secret',
    default: nconf.get('secret') || '5201314'
  },
  {
    name: 'database',
    description: 'Which database to use',
    default: nconf.get('database') || 'mongo'
  }
];
questions.optional = [
  {
    name: 'port',
    default: nconf.get('port') || 4567
  }
];
install.setup = () => {
  return Promise.reduce([checkSetupFlag(),
    checkCIFlag(),
    setupConfig()], (total, value) => {

  }, 0)
    .then((total) => {

    });
};
install.save = (serverConf) => {
  let serverConfigPath = path.join(__dirname, './config.json');
  if (nconf.get('config')) {
    serverConfigPath = path.resolve(__dirname, './', nconf.get('config'));
  }
  console.log(serverConfigPath)
  fs.writeFile(serverConfigPath, JSON.stringify(serverConf, null, 4), (err) => {
    if (err) {
      logger.error(`Error saving server configuration! ${err.message}`);
      return Promise.reject(err);
    }
    process.stdout.write('COnfiguration Saved OK\n');
    nconf.file({
      file: path.join(__dirname, '..', 'config.json')
    });
    return Promise.resolve();
  });
};
function checkSetupFlag() {
  let setupVal;
  try {
    if (nconf.get('setup')) {
      setupVal = JSON.parse(nconf.get('setup'));
    }
  } catch (err) {
    setupVal = undefined;
  }
  if (setupVal && setupVal instanceof Object) {
    if (setupVal['admin:username'] && setupVal['admin:password'] && setupVal['admin:password:confirm'] && setupVal['admin:email']) {
      install.values = setupVal;
      return Promise.resolve();
    } else {
      logger.error('Required values are missing for automated setup:');
      if (!setupVal['admin:username']) {
        logger.error('  admin:username');
      }
      if (!setupVal['admin:password']) {
        logger.error('  admin:password');
      }
      if (!setupVal['admin:password:confirm']) {
        logger.error('  admin:password:confirm');
      }
      if (!setupVal['admin:email']) {
        logger.error('  admin:email');
      }
      process.exit();
    }
  } else if (nconf.get('database')) {
    install.values = {
      database: nconf.get('database')
    };
    return Promise.resolve();
  } else {
    return Promise.resolve();
  }
}
function checkCIFlag() {
  let ciVals;
  try {
    ciVals = JSON.parse(nconf.get('ci'));
  } catch (err) {
    ciVals = undefined;
  }
  if (ciVals && ciVals instanceof Object) {
    if (ciVals.hasOwnProperty('host') && ciVals.hasOwnProperty('port') && ciVals.hasOwnProperty('database')) {
      install.ciVals = ciVals;
      return Promise.resolve();
    } else {
      logger.error('Required values are missing for automated CI integration:');
      if (!ciVals.hasOwnProperty('host')) {
        logger.error('  host');
      }
      if (!ciVals.hasOwnProperty('port')) {
        logger.error('  port');
      }
      if (!ciVals.hasOwnProperty('database')) {
        logger.error('  database');
      }

      process.exit();
    }
  } else {
    return Promise.resolve();
  }
}
function setupConfig() {
  let configureDatabases = require('./install/databases').default;
  prompt.start();
  prompt.message = '';
  prompt.delimiter = '';
  prompt.colors = false;
  return Promise.resolve()
    .then(() => {
      if (install.values) {
        let config = {};
        let redisQuestions = require('./database/redis').questions;
        let mongoQuestions = require('./database/mongo').questions;
        let allQuestions = questions.main.concat(questions.optional).concat(redisQuestions).concat(mongoQuestions);
        allQuestions.forEach((question) => {
          config[question.name] = install.values[question.name] || question.default || undefined;
        });
        return Promise.resolve(config);
      } else {
        return prompt.getAsync(questions.main);
      }
    }).then((config) => {
      return configureDatabases(config);
    }).then((config) => {
      return completeConfigSetup(config);
    });
}
function completeConfigSetup(config) {
  if (install.ciVals) {
    config.test_database = {};
    for (let prop in install.ciVals) {
      if (install.ciVals.hasOwnProperty(prop)) {
        config.test_database[prop] = install.ciVals[prop];
      }
    }
  }
  Promise.resolve()
    .then(() => {
      return install.save(config);
    });
}
export default install;
