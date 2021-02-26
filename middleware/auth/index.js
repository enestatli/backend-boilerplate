const jwt = require('jsonwebtoken');

const UserModel = require('../../db/models/user');
const log = require('../../logger');

// TODO: put middlewares into class

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'my little secret', (err, decodedToken) => {
      if (err) {
        log("error", err.message);
        // TODO check status code
        //TODO mb user redirect to the login
        return;
      }
      return next();
    });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    return next();
  }
  jwt.verify(token, 'my little secret', async (err, decodedToken) => {
    if (err) {
      log("error", err.message.toString());
      res.locals.user = null;
      return next();
    }
    let user = await UserModel.findById(decodedToken.id);
    res.local.user = user;
    return next();
  });
};

module.exports = { requireAuth, checkUser };
