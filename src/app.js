require('dotenv/config');
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const FlutterwaveEvents = require('flutterwave-events');
const routesV1 = require('./routes/v1');
const config = require('./config');
const errorClasses = require('./utils/errors');

// const flutterwaveEvents = new FlutterwaveEvents(config.FLW_SECRET_HASH);


// const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send({ message: `Welcome to ${config.APP_NAME} server!` }));

// Mount documentation file
app.get('/api-docs', (req, res) => res.status(200).sendFile(path.join(__dirname, '..', 'docs', 'index.html')));

// app.use('/api/v1/payment-webhooks', log, flutterwaveEvents.webhook());
app.use('/api/v1/', routesV1);

// flutterwaveEvents.on('charge.success', (data)=> {
//   console.log('Successful charge')
//   console.log(data)
// })

// Global 404 error handler
app.use((req, res, next) => res.status(404).send({
  status: 'fail',
  error: '404_NOT_FOUND_ERROR',
  message: 'You have entered a black hole, find your way out!',
}));

app.use((err, req, res, next) => {
  if (config.NODE_ENV !== 'test') {
    config.logger.error(`
      Error caught at ${req.path}, 
      Request body: ${JSON.stringify(req.body)},
      Request User: ${JSON.stringify(req.user)},
      Request Params: ${JSON.stringify(req.params)}
      Request Query: ${JSON.stringify(req.query)}
      Error Message: ${JSON.stringify(err.message)}
      Error Logs: ${JSON.stringify(err.stack)}
  }`);
  }
  const isKnownError = Object.keys(errorClasses).some((e) => err instanceof errorClasses[e]);
  if (!isKnownError) {
    // Wrap error in a generic error class then return response to user
    // eslint-disable-next-line no-param-reassign
    err = new errorClasses.GenericError(err.message, err);
  }
  return res.status(err.statusCode).send(err.error);
});

// In a seemingly unlikely event of unhandled Promise getting rejected,
// Here is the saviour to the server not getting crashed! However,
// this should be attended to with utmost alacrity
process.on('unhandledRejection', (error) => {
  config.logger.error('FATAL UNEXPECTED UNHANDLED REJECTION!', error.message);
  throw error;
});

module.exports = app;
