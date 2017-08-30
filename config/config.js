/**
 * Created by pure on 2017/8/30.
 */
import {config as dotenvConfig} from 'dotenv';
dotenvConfig();
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT
};
export default config;
