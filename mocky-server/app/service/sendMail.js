'use strict';

const Service = require('egg').Service;

module.exports = class DataMapService extends Service {
  async send(mailMessage) {
    await this.app.sendMail(mailMessage);
  }

  async sendEmailVerifyMail(to, emailType) {
    const { helper, service }  = this.ctx;
    const code = helper.random();

    await service.cache.setEmailVerifyCode(to, emailType.type, code);

    const content = emailType.render({ code });
    await this.send({
      to,
      subject: emailType.subject,
      text: content,
      html: content,
    });
  }
};
