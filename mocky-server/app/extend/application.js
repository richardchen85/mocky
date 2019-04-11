'use strict';

const mail = require('../common/mail');

module.exports = {
  async sendMail(mailMessage) {
    await mail.sendMail(this.config.mail, mailMessage);
  },
};
