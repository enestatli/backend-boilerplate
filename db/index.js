const mongoose = require('mongoose');

const { config } = require('../config');
const { logger } = require('../logger');

mongoose
  .connect(`${config.mongoDbAtlasUri}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info(`Connected to mongodb: ${config.mongoDbAtlasUri}`);
  });

mongoose.connection.on('error', (err) => {
  logger.error(err);
});
