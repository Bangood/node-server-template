/**
 * Created by pure on 2017/8/30.
 */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import expressWinston from 'express-winston';
import httpStatus from 'http-status';

import config from '../config/config';
import routes from '../routes/index.route';
import logger from '../config/logger';
import {ClientError} from '../helpers/APIError';
const app = express();

// Parse HTTP request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Parse cookie header and populate req.cookies.
app.use(cookieParser());
// Compress HTTP responses.
app.use(compress());
// Override HTTP methods using header.
app.use(methodOverride());
// Enable cross-origin resource sharing (CORS) with various options.
if (config.env === 'development') {
  app.use(cors());
}
// Helps secure your apps by setting various HTTP headers.
app.use(helmet());
// bad request
app.use((err, req, res, next) => {
  const error = new ClientError(`Invalid request body-${err.message}`, 10001);
  next(error);
});
// express-winston provides middlewares for request and error logging
app.use(expressWinston.logger({
  winstonInstance: logger
}));
app.use('/api', routes);
// catch 404
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).send('NOT　FOUND');
});
// client error handler.
app.use((err, req, res, next) => {
  if (err.code && err.code > 10000) {
    logger.error(err.message);
    res.json({
      code: err.code,
      errMsg: err.message
    });
  } else {
    next(err);
  }
});
// error handler.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    errMsg: 'Internal Server Error'
  });
});
export default app;
