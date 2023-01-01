const logger = require('pino');

const { env } = process;

module.exports = () => {
  const testConfig = {};

  // Reassign testuction properties
  Object.values(env).forEach(([key, value]) => {
    if (key.startsWith('test')) {
      // eslint-disable-next-line no-param-reassign
      key = key.slice(5, key.length);
    }
    testConfig[key] = value;
  });
  testConfig.logger = logger();

  return testConfig;
};
