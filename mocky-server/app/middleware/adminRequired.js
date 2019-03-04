/**
 * need admin
 */

'use strict';

module.exports = () => {
  return async function adminRequired(ctx, next) {
    if (!ctx.user || !ctx.user.isAdmin) {
      ctx.status = 403;
      return;
    }
    await next();
  };
};
