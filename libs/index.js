const log = require('../logger');

const querystring = require('querystring');
const { renderer } = require('./renderer');
const { transporter } = require('./transporter');

class Email {
  async ResetPassword(link, email) {
    try {
      const filename = 'password-recovery';
      const html = renderer(filename, { link });

      await transporter.sendMail({
        from: 'eenestatli@gmail.com',
        to: email,
        subject: 'BackendBoilerPlate reset password',
        html,
      });
      log("info", `Password reset email sent to ${email}`);
    } catch (error) {
      log("error", 'Error in ResetPassword <Email>' + error.toString());
    }
  }

  async VerifyEmail(link, email) {
    try {
      const filename = 'email-verification';
      const html = renderer(filename, { link });

      await transporter.sendMail({
        from: 'info@backendboilerplate.com',
        to: email,
        subject: 'BackendBoilerPlate verify your email',
        html,
      });
    } catch (error) {}
  }
}

const SendEmail = new Email();

module.exports = { SendEmail };
