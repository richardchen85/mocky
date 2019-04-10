'use strict';

const nodemailer = require('nodemailer');

module.exports = {
  async sendMail(config, message) {
    let transporter = nodemailer.createTransport(config);

    message = Object.assign({}, message, {
      from: config.from,
    });

    await transporter.sendMail(message);
  },
};
