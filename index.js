const express = require('express');

require('dotenv').config();

const { config } = require('./config');
const { logger } = require('./logger');
const { useMiddlewares } = require('./middleware');

const app = express();

require('./db');

useMiddlewares(app);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(config.port, () =>
  logger.info(`Express is on http://localhost:${config.port}`)
);
