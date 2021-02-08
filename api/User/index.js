const UserModel = require('../../db/models/user');
const { logger } = require('../../logger');

class User {
  constructor(route) {
    this.route = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post('/auth/register', this.registerUser.bind(this));
    this.router.post('/auth/register', this.loginUser.bind(this));
  }

  async loginUser(req, res) {
    if (!req || !req.body || !req.body.email || !req.body.password) {
      res.sendStatus(422); // unprocessable entity
      return;
    }

    const user = await UserModel.login(req.body.email, req.body.password);
    try {
      if (!user || !user.email) {
        res.sendStatus(422);
        return;
      }
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

    const user = await UserModel.createNew({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    try {
      if (user && user.email) {
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
