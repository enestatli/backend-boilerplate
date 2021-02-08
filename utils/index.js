const jwt = require('jsonwebtoken');

class Utils {
  static maxAge = 3 * 24 * 60 * 60;
  static createToken(id) {
    return jwt.sign({ id }, 'my little secret', { expiresIn: this.maxAge });
  }
}

module.exports = { Utils };
