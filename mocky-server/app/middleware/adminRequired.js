/**
 * need admin
 */

'use strict';

module.exports = () => {
  return async function adminRequired(ctx, next) {
    if (!ctx.user || !ctx.user.isAdmin) {
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
