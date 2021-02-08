const express = require('express');

require('dotenv').config();

const { config } = require('./config');
const { logger } = require('./logger');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(config.port, () => logger.info(`Express is on ${config.port}`));
