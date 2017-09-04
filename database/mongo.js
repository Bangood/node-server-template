/**
 * Created by pure on 2017/9/4.
 */
import nconf from 'nconf';
const questions = [
  {
    name: 'mongo:host',
    description: 'Host IP or address of your MongoDB instance',
    default: nconf.get('mongo:host') || '127.0.0.1'
  },
  {
    name: 'mongo:port',
    description: 'Host port of your MongoDB instance',
    default: nconf.get('mongo:port') || 27017
  },
  {
    name: 'mongo:username',
    description: 'MongoDB username',
    default: nconf.get('mongo:username') || ''
  },
  {
    name: 'mongo:password',
    description: 'Password of your MongoDB database',
    hidden: true,
    default: nconf.get('mongo:password') || '',
    before: function (value) { value = value || nconf.get('mongo:password') || ''; return value; }
  },
  {
    name: 'mongo:database',
    description: 'MongoDB database name',
    default: nconf.get('mongo:database') || 'nodebb'
  }
];
export {questions};
