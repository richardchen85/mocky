'use strict';

const Controller = require('../core/baseController');
const { sendMailRules } = require('../validateRules/mail');
const emailTypes = require('../common/emailTypes');

class MailController extends Controller {
  async sendMail() {
    const { request, logger, service } = this.ctx;
    const param = request.body;

    if (!this.isValid(sendMailRules, param)) return;

    try {
      const emailType = emailTypes.getByType(param.type);

      if (!emailType) {
        this.fail('未知的邮件类型');
        return;
      }

      await service.sendMail[emailType.service](param.email, emailType);
      this.success('邮件发送成功');
    } catch (e) {
      logger.error(e);
      this.fail('邮件发送失败');
    }
  }
}

module.exports = MailController;
