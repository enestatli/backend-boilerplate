const express = require('express');

require('dotenv').config();

const { config } = require('./config');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(config.port, () => console.log(`Express is on ${config.port}`));
