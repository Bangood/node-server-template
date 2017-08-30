/**
 * Created by pure on 2017/8/30.
 */
import {config as dotenvConfig} from 'dotenv';
import Joi from 'joi';
// configure dotenv, will load vars in .env file into process.env
dotenvConfig();
// define validation for all the env vars.
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(['development', 'production'])
    .default('development'),
  PORT: Joi.number()
    .default(4040)
}).unknown();
const {error, value: envVars} = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT
};
export default config;
