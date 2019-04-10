'use strict';

module.exports = {
  types: {
    EMAIL_VERIFY: {
      type: 1,
      subject: 'mocky 邮箱验证',
      render(data) {
        return ``;
      },
    },
  },
  getByType(type) {
    const { types } = this;
    return Object.keys(types)
      .filter(key => types[key].type === type)
      .map(key => types[key])[0];
  },
};
