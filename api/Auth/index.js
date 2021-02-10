const UserModel = require('../../db/models/user');
const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { Utils } = require('../../utils');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Auth {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post(
      '/auth/register',
      protectWithApiKey,
      requireAuth,
      this.registerUser.bind(this)
    );
    this.router.post(
      '/auth/login',
      protectWithApiKey,
      requireAuth,
      this.loginUser.bind(this)
    );
  }

  async loginUser(req, res) {
    if (!req || !req.body || !req.body.email || !req.body.password) {
      res.sendStatus(400); // missing body
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
      res.sendStatus(400); // missing body
      return;
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser !== null) {
        res.sendStatus(409); // conflict
        return;
      }

      const user = await UserModel.createNew({ name, email, password });

      if (user && user.email) {
        const token = Utils.createToken(user._id);
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: Utils.maxAge * 1000,
        });
        // res.sendStatus(201); // Created
        res.json({ user, status: 201, authorized: true });
        return;
      }
    } catch (error) {
      logger.error('Error in registeredUser <Auth>', error);
      res.sendStatus(500); // server error
    }
  }
}

module.exports = { Auth };
