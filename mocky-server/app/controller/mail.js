'use strict';

const Controller = require('../core/baseController');
const messages = require('../common/messages');
const { sendMail } = require('../validateRules/mail');
const emailTypes = require('../common/emailTypes');

function mailMessage({ type, email }, data = {}) {
  const emailType = emailTypes.getByType(type);
  const content = emailType.render(data);
  return {
    to: email,
    subject: emailType.subject,
    text: emailType.render(data),
    html: emailType.render(),
  };
}

class MailController extends Controller {
  sendMail() {
    const { request, response, logger, service } = this.ctx;
    const param = request.body;

    if (!this.isValid(sendMail, param)) return;

    try {
      this.app.sendMail(mailMessage(param))
    } catch (e) {
      logger.error(e);
      this.fail('邮件发送失败');
    }
  }
}

module.exports = MailController;
