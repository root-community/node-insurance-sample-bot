const actionMap = require('./action-map');
const App = require('actions-on-google').DialogflowApp;
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('./logger');
const { errorHandler, asyncWrapper } = require('./middleware');

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(bodyParser.json());
app.use('/', asyncWrapper(async (req, res, next) => {
  const app = new App({ request: req, response: res });

  app.handleRequest(actionMap);
}));
app.use(errorHandler);
app.listen(port, () => logger.info(`Listening on ${port}`));
