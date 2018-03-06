const logger = require('./logger');
const rp = require('request-promise');

const baseUrl = process.env.ROOT_BASE_URL || 'https://sandbox.root.co.za/v1/insurance';

module.exports = (endpoint, method, body) => {
  logger.info(`Root API request to '${method} ${endpoint}': ${JSON.stringify(body)}`);

  return rp({
    auth: {
      user: process.env.ROOT_API_KEY,
      pass: ''
    },
    json: true,
    uri: baseUrl + endpoint,
    method,
    body
  });
};
