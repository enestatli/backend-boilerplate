const UserModel = require("../../db/models/user");
const log = require("../../logger");
const { requireAuth } = require("../../middleware/auth");
const { Utils } = require("../../utils");
const { protectWithApiKey } = require("../../middleware/protectWithApiKey");
const { config } = require("../../config");
const { SendEmail } = require("../../libs");

class Auth {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post(
      "/auth/register",
      protectWithApiKey,
      // requireAuth,
      this.register.bind(this)
    );
    this.router.post(
      "/auth/login",
      protectWithApiKey,
      // requireAuth,
      this.login.bind(this)
    );
    this.router.post(
      "/auth/social-login",
      protectWithApiKey,
      // requireAuth,
      this.socialLogin.bind(this)
    );
    this.router.post(
      "/auth/update-password",
      protectWithApiKey,
      this.updatePassword.bind(this)
    );
    this.router.post(
      "/auth/forget-password",
      protectWithApiKey,
      this.forget.bind(this)
    );
    this.router.post(
      "/auth/verify-email",
      protectWithApiKey,
      this.verifyEmail.bind(this)
    );
  }

  async verifyEmail(req, res) {
    if (!req.body || !req.body.email || !req.body.token) {
      res.sendStatus(400); // missing body
      return;
    }

    const { email, token } = req.body;
    const user = await UserModel.findOne({ email });

    try {
      if (user === null) {
        res.sendStatus(404); // user doesn't exist
        return;
      }

      const decoded = Utils.verify(token);

      if (!decoded) {
        res.sendStatus(403); // wrong token provided
        return;
      }

      user.email_verified = true;
      const updated = await user.save();
      return res.json({
        authorized: true,
        user: updated,
        token: Utils.createToken(updated._id.toJSON()),
      });
    } catch (error) {
      log("error", "Error in verifyEmail <Auth>" + error.toString());
      res.sendStatus(500);
    }
  }

  async socialLogin(req, res) {
    if (!req.body || !req.body.name || !req.body.email) {
      res.sendStatus(400); // missing body
      return;
    }

    const { name, email, password } = req.body;

    try {
      const user = await UserModel.createNew({
        name,
        email,
        password,
        email_verified: true,
      });

      if (typeof user === "number") {
        res.sendStatus(user);
        return;
      }

      if (user && user.email) {
        const token = Utils.createToken(user._id.toJSON());
        res.json({ user, status: 201, authorized: true, token });
        return;
      }
    } catch (error) {
      log("error", "Error in socialLogin <Auth>" + error.toString());
      res.sendStatus(500); // server error
    }
  }

  async login(req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
      res.sendStatus(400); // missing body
      return;
    }

    const { email, password } = req.body;
    const user = await UserModel.login(email, password);

    try {
      if (typeof user === "number") {
        res.sendStatus(user); // user doesn't exist or wrong password
        return;
      }

      const token = Utils.createToken(user._id.toJSON());
      res.json({ user, authorized: true, status: 200, token });
    } catch (error) {
      log("error", __dirname + "\\index.js" + error.toString());
      res.sendStatus(500);
    }
  }

  async register(req, res) {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      res.sendStatus(400); // missing body
      return;
    }

    const { name, email, password } = req.body;

    try {
      const user = await UserModel.createNew({
        name,
        email,
        password,
        email_verified: false,
      });

      if (typeof user === "number") {
        res.sendStatus(user);
        return;
      }

      if (user && user.email) {
        const token = Utils.createToken(user._id.toJSON());
        const queries = Utils.queryStrinify(user);
        const verifyUrl = `${config.baseUrl}/verify-email?${queries}`;

        SendEmail.VerifyEmail(verifyUrl, email);

        res.json({ user, status: 201, authorized: true, token });
        return;
      }
    } catch (error) {
      log("error", "Error in registeredUser <Auth>" + error.toString());
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
            log("error", "Error in updatePassword <Auth>" + e.toString());
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(403); // wrong token provided
      }
    } catch (error) {
      log("error", __dirname + "\\index.js" + error.toString());
      res.sendStatus(500);
    }
  }

  async forget(req, res) {
    if (!req.body || !req.body.email) {
      res.sendStatus(400);
      return;
    }

    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (user === null) {
        res.sendStatus(404);
        return;
      }

      const queries = Utils.queryStrinify(user);
      const resetUrl = `${config.baseUrl}/update-password?${queries}`;

      await SendEmail.ResetPassword(resetUrl, user.email);
      res.sendStatus(204); // success
    } catch (error) {
      log("error", __dirname + "\\index.js" + error.toString());
      res.sendStatus(500);
    }
  }
}

module.exports = { Auth };
