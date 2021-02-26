const mongoose = require('mongoose');

const { config } = require('../config');
const log = require('../logger');

mongoose
  .connect(`${config.mongoDbAtlasUri}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    log("info", `Connected to mongodb: ${config.mongoDbAtlasUri}`);
  });

mongoose.connection.on('error', (err) => {
  log("error", err.toString());
});
