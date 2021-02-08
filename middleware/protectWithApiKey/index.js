const { config } = require('../../config');

const protectWithApiKey = (req, res, next) => {
  const key = req.header('apiKey');
  if (config.myApi === key) {
    return next();
  }
  res.sendStatus(403); // Forbidden
};

module.exports = { protectWithApiKey };
