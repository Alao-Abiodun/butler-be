const app = require('./src/app');
const db = require('./src/db');
const config = require('./src/config');

// console.log(config.logger);

(async () => {
  process.on('warning', (e) => config.logger.warn(e.stack));
  config.logger.info('Waiting for DATABASE Connection...');
  await db.connect();
  app.listen(config.PORT, async () => {
    config.logger.info(`${config.APP_NAME} API listening on ${config.PORT}`);
  });
})();
