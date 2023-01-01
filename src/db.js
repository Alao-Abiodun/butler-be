const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const { logger, DATABASE_URL } = require('./config');

let _pool;

const moongoseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = async () => {
  const connection = await mongoose.connect(
    `${DATABASE_URL}`, moongoseConfig,
  );
  if (!connection) {
    logger.error('DATABASE connection failed! Exiting Now', { err });
    process.emit('SIGTERM');
    process.exit(1);
  }
  _pool = connection;
  logger.info('DATABASE connected successfully!');
  return connection;
};

const getPool = () => _pool;

module.exports = { connect, getPool };
