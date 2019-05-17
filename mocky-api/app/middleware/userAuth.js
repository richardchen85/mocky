/**
 * user authentication middleware
 */

'use strict';

module.exports = config => {
  return async function userAuth(ctx, next) {
    const { cookies, helper, service, request, logger } = ctx;
    const uid = cookies.get(config.cookie_key, {
      encrypt: true,
    });

    // 跳过排除项
    if (config.excludes && helper.inFilter(config.excludes, request.url)) {
      return await next();
    }

    // 如果 includes 不为空，则跳过不在 includes 范围内的请求
    if (config.includes && !helper.inFilter(config.includes, request.url)) {
      return await next();
    }

    if (uid) {
      try {
        const user = await service.user.getById(uid);
        if (user) {
          if (config.adminUsers.indexOf(user.id) >= 0) {
            user.isAdmin = true;
            ctx.isAdmin = true;
          }
          ctx.user = user;
        }
      } catch (e) {
        logger.error(e);
      }
    }

    await next();
  };
};
