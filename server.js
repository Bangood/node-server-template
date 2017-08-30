/**
 * Created by pure on 2017/8/29.
 */
import app from './config/express';
import config from './config/config';
import logger from './config/logger';
app.listen(config.port, () => {
  logger.info(`server started on port ${config.port} (${config.env})`);
});
