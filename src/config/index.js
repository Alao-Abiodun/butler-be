const devConfig = require('./development');
const stagingConfig = require('./staging');
const testConfig = require('./test');
const prodConfig = require('./production');

let config;
switch (process.env.NODE_ENV) {
  case 'development':
    config = devConfig();
    break;
  case 'test':
    config = testConfig();
    break;
  case 'staging':
    config = stagingConfig();
    break;
  case 'production':
    config = prodConfig();
    break;
  default:
    config = devConfig();
}

module.exports = config;
