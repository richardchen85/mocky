'use strict';

module.exports = {
  signUp: {
    email: { type: 'email', min: 5, max: 50 },
    nickname: { type: 'string', min: 5, max: 20, format: /^\w+$/i },
    password: { type: 'string', min: 6, max: 12 },
  },
  login: {
    email: { type: 'email', min: 5, max: 50 },
    password: { type: 'string', min: 6, max: 20 },
  },
};
