const jwt = require('jsonwebtoken');
const querystring = require('querystring');

class Utils {
  static maxAge = 3 * 24 * 60 * 60;
  static createToken(id) {
    const token = jwt.sign({ id }, 'my little secret', {
      expiresIn: this.maxAge,
    });
    return token;
  }

  static verify(token) {
    const decoded = jwt.verify(token, 'my little secret');
    return decoded;
  }

  static queryStrinify(email, token) {
    return querystring.stringify({ email, token });
  }
}

module.exports = { Utils };
