'use strict';

const Service = require('egg').Service;
const cacheKeys = require('../common/cacheKeys');

module.exports = class DataMapService extends Service {
  async send(mailMessage) {
    await this.app.sendMail(mailMessage);
  }

  async sendEmailVerifyMail(to, emailType) {
    const {
      app: { redis },
      ctx: { helper },
    } = this;
    const code = helper.random();
    const cacheKey = cacheKeys.EMAIL_VERIFY_PREFIX + `${to}_${emailType.type}`;

    await redis.setex(cacheKey, 60 * 60 * 24, code);

    const content = emailType.render({ code });
    await this.send({
      to,
      subject: emailType.subject,
      text: content,
      html: content,
    });
  }
};
