'use strict';

const nodemailer = require('nodemailer');

module.exports = {
  async sendMail(config, message) {
    const transporter = nodemailer.createTransport(config);

    message = Object.assign({}, message, {
      from: config.from,
    });

    await transporter.sendMail(message);
  },
};
