const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  } else {
    logger.error(err);
    res.status(500).send();
  }
};

const asyncWrapper = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  errorHandler,
  asyncWrapper
};
