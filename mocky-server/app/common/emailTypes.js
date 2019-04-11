'use strict';

module.exports = {
  types: {
    EMAIL_VERIFY: {
      type: 1,
      subject: 'mocky 邮箱验证',
      render(data) {
        return `欢迎使用 mocky，您本次邮箱验证码为：${data.code}`;
      },
      service: 'sendEmailVerifyMail'
    },
  },
  getByType(type) {
    const { types } = this;
    return Object.keys(types)
      .filter(key => types[key].type === type)
      .map(key => types[key])[0];
  },
};
