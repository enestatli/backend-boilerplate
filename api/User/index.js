const UserModel = require('../../db/models/user');
const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { Utils } = require('../../utils');

class User {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post(
      '/auth/register',
      requireAuth,
      this.registerUser.bind(this)
    );
    this.router.post('/auth/login', requireAuth, this.loginUser.bind(this));
  }

  async loginUser(req, res) {
    if (!req || !req.body || !req.body.email || !req.body.password) {
      res.sendStatus(422); // unprocessable entity
      return;
    }

    const user = await UserModel.login(req.body.email, req.body.password);
    try {
      if (!user || !user.email) {
        res.sendStatus(404); // Not Found
        return;
      }
      const token = Utils.createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: Utils.maxAge * 1000 });
      res.json(user);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  }

  async registerUser(req, res) {
    if (
      !req ||
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.password
    ) {
      res.sendStatus(422); // unprocessable entity
      return;
    }

    const { name, email, password } = req.body;
    const user = await UserModel.createNew({ name, email, password });

    try {
      if (user && user.email) {
        const token = Utils.createToken(user._id);
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: Utils.maxAge * 1000,
        });
        // res.sendStatus(201); // Created
        res.json(user);
        return;
      }
      res.sendStatus(409); // conflict
    } catch (error) {
      logger.error(error);
      res.sendStatus(500); // server error
    }
  }
}

module.exports = { User };
