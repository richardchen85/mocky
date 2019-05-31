'use strict';

module.exports = {
  types: {
    SIGN_UP: {
      type: 1,
      subject: 'mocky 用户注册验证码',
      render(data) {
        return `非常感谢您注册 mocky，您本次注册的验证码为：${data.code}`;
      },
      service: 'sendEmailVerifyMail',
    },
    RESET_PASS: {
      type: 2,
      subject: 'mocky 密码重置验证码',
      render(data) {
        return `非常感谢您使用 mocky，您本次密码重置的验证码为：${data.code}`
      },
      service: 'sendEmailVerifyMail'
    }
  },
  getByType(type) {
    const { types } = this;
    return Object.keys(types)
      .filter(key => types[key].type === type)
      .map(key => types[key])[0];
  },
};
