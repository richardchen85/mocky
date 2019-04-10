'use strict';

const mail = require('../common/mail');

module.exports = {
  sendMail(mailMessage) {
    return mail.sendMail(this.config.mail, mailMessage);
  },
};
