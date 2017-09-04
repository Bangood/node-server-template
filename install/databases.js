/**
 * Created by pure on 2017/9/4.
 */
import {questions as mongoQuestions} from '../database/mongo';
import {questions as redisQuestions} from '../database/redis';
import Promise from 'bluebird';
import prompt from 'prompt';
import logger from '../config/logger';
prompt.getAsync = Promise.promisify(prompt.get);
const questions = {
  redis: redisQuestions,
  mongo: mongoQuestions
};

function configDatabases(config) {
  return Promise.resolve()
    .then(() => {
      process.stdout.write('\n');
      logger.info(`Now configuring ${config.database} database:`);
      return getDatabaseConfig(config);
    }).then((databaseConfig) => {
      return saveDatabaseConfig(config, databaseConfig);
    });
}
function getDatabaseConfig(config) {
  if (!config) {
    return Promise.reject(new Error('aborted'));
  }
  if (config.database === 'redis') {
    if (config['redis:host'] && config['redis:port']) {
      return Promise.resolve(config);
    } else {
      return prompt.getAsync(questions.redis);
    }
  } else if (config.database === 'mongo') {
    if (config['mongo:host'] && config['mongo:port']) {
      return Promise.resolve(config);
    } else {
      return prompt.getAsync(questions.mongo);
    }
  } else {
    return Promise.reject(new Error(`unknown database: ${config.database}`));
  }
}
function saveDatabaseConfig(config, databaseConfig) {
  if (!databaseConfig) {
    return Promise.reject(new Error('aborted'));
  }
  if (config.database === 'redis') {
    config.redis = {
      host: databaseConfig['redis:host'],
      port: databaseConfig['redis:port'],
      password: databaseConfig['redis:password'],
      database: databaseConfig['redis:database']
    };
    if (config.redis.host.slice(0, 1) === '/') {
      delete config.redis.port;
    }
  } else if (config.database === 'mongo') {
    config.mongo = {
      host: databaseConfig['mongo:host'],
      port: databaseConfig['mongo:port'],
      username: databaseConfig['mongo:username'],
      password: databaseConfig['mongo:password'],
      database: databaseConfig['mongo:database']
    };
  } else {
    return Promise.reject(new Error(`unknown database: ${config.database}`));
  }
  let allQuestions = questions.redis.concat(questions.mongo);
  for (let x = 0; x < allQuestions.length; ++x) {
    delete config[allQuestions[x].name];
  }
  return Promise.resolve(config);
}
export default configDatabases;
