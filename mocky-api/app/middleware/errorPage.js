/**
 * handle error from ctx.status
 */

'use strict';

const messages = require('../common/messages');

module.exports = () => {
  return async function errorPage(ctx, next) {
    await next();

    const { status } = ctx;

    if (status === 200) return;

    let message;
    if (status === 404) {
      message = messages.common.notFound;
    } else if (status === 502) {
      message = messages.common.sysError;
    } else if (status === 403) {
      message = messages.user.noPermission;
    }

    if (ctx.acceptJSON) {
      ctx.body = {
        success: false,
        message,
        code: status,
      };
    } else {
      await ctx.render('index');
    }
  };
};
