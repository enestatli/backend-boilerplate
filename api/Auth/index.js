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
    this.router.post(
      '/password',
      protectWithApiKey,
      requireAuth,
      this.updatePassword.bind(this)
    );
  }

  async loginUser(req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
      res.sendStatus(400); // missing body
      return;
    }

    const { email, password } = req.body;

    const user = await UserModel.login(req.body.email, req.body.password);
    try {
      const user = await UserModel.findOne({ email });
      if (user === null) {
        res.sendStatus(404); // user doesn't exist
        return;
      }

      const token = Utils.createToken(user._id.toJSON());
      res.json({ user, authorized: true, status: 200, token });
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  }

  async registerUser(req, res) {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
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
        const token = Utils.createToken(user._id.toJSON());
        res.json({ user, status: 201, authorized: true, token });
        return;
      }
    } catch (error) {
      logger.error('Error in registeredUser <Auth>', error);
      res.sendStatus(500); // server error
    }
  }

  async updatePassword(req, res) {
    if (!req.body || !req.body.email || !req.body.password || !req.body.token) {
      res.sendStatus(400); // missing body
      return;
    }

    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (user === null) {
        res.sendStatus(404);
      }

      const decoded = Utils.verify(req.body.token);
      if (decoded) {
        user.password = req.body.password;
        user
          .save()
          .then(() => res.sendStatus(204)) // success
          .catch((e) => {
            logger.error('Error in updatePassword <Auth>', e);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(403); // wrong token provided
      }
    } catch (error) {
      logger.error('Error in updatePassword <Auth>', error);
      res.sendStatus(500);
    }
  }
}

module.exports = { Auth };
