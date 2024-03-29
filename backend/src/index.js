const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const db = require('./config/db');

let server;
db.connect
  .then(() => {
    logger.info('Connected to Database successfully');
    server = app.listen(config.port, async () => {
      logger.info(`Listening at http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
