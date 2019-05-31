'use strict';

const Service = require('egg').Service;
const cacheKeys = require('../common/cacheKeys');

module.exports = class DataMapService extends Service {
  async send(mailMessage) {
    await this.app.sendMail(mailMessage);
  }

  async setEmailVerifyCode(email, type, code) {
    const key = cacheKeys.emailVerify(email, type);
    return this.service.cache.set(key, code);
  }

  async getEmailVerifyCode(email, type) {
    return this.service.cache.get(cacheKeys.emailVerify(email, type));
  }

  async delEmailVerifyCode(email, type) {
    return this.service.cache.del(cacheKeys.emailVerify(email, type));
  }

  async sendEmailVerifyMail(to, emailType) {
    const code = this.ctx.helper.random();

    await this.setEmailVerifyCode(to, emailType.type, code);

    const content = emailType.render({ code });
    await this.send({
      to,
      subject: emailType.subject,
      text: content,
      html: content,
    });
  }
};
