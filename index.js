const express = require('express');

require('dotenv').config();

const { config } = require('./config');
const log = require('./logger');
const { useMiddlewares } = require('./middleware');
const router = require('./api');
const { checkUser } = require('./middleware/auth');

const app = express();

require('./db');

useMiddlewares(app);

// app.get('*', checkUser);
app.use('/api', router);

app.listen(config.port, () =>
  log("info", `Express is on http://localhost:${config.port}`)
);
