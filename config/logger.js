/**
 * Created by pure on 2017/8/30.
 */
import fs from 'fs';
import winston from 'winston';
import moment from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';

import config from './config';
const dateFormat = () => moment().format('YYYY-MM-DD HH:mm:ss:SSS');

let logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      timestamp: dateFormat,
      colorize: true,
      level: 'verbose',
      json: false
    })
  ]
});
if (config.env === 'production') {
  if (!fs.existsSync('log')) {
    fs.mkdirSync('log');
  }
  const allLoggerTransport = new DailyRotateFile({
    name: 'all',
    filename: 'log/all.log',
    timestamp: dateFormat,
    level: 'info',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd'
  });
  const errorTransport = new (winston.transports.File)({
    name: 'error',
    filename: 'log/error.log',
    timestamp: dateFormat,
    level: 'error',
    colorize: true
  });
  logger = new (winston.Logger)({
    transports: [
      allLoggerTransport,
      errorTransport
    ]
  });
  // crash logger
  const crashLogger = new (winston.Logger)({
    name: 'error',
    filename: 'log/crash.log',
    level: 'error',
    timestamp: dateFormat,
    humanReadableUnhandledException: true,
    json: false,
    colorize: true
  });
}
export default logger;
