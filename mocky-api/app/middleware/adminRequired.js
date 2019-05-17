/**
 * need admin
 */

'use strict';

const messages = require('../common/messages');

module.exports = config => {
  return async function adminRequired(ctx, next) {
    const { request, helper, user } = ctx;

    // 跳过排除项
    if (config.excludes && helper.inFilter(config.excludes, request.url)) {
      return await next();
    }

    // 如果 includes 不为空，则跳过不在 includes 范围内的请求
    if (config.includes && !helper.inFilter(config.includes, request.url)) {
      return await next();
    }

    if (!user || !user.isAdmin) {
      if (ctx.acceptJSON) {
        ctx.body = {
          success: false,
          message: messages.common.notAllowed,
          code: 403,
        };
      } else {
        ctx.status = 403;
      }
      return;
    }
    await next();
  };
};
