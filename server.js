/**
 * Created by pure on 2017/8/29.
 */
import app from './config/express';
import config from './config/config';
app.listen(config.port, () => {
  console.log(`server started on port ${config.port} (${config.env})`);
});
