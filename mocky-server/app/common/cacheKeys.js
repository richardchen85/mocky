'use strict';

module.exports = {
  EMAIL_VERIFY_PREFIX: (email, type) => `emailVerify_${email}_${type}`,
  USER: id => 'user_' + id,
  PROJECT: id => 'project_' + id,
};
