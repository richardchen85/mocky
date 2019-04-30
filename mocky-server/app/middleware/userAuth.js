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

    let user;
    if (uid) {
      try {
        user = await service.cache.getUser(uid);
      } catch (e) {
        logger.error(e);
      }

      if (!user) {
        try {
          user = await service.user.getById(uid);
        } catch (e) {
          logger.error(e);
        }
      }
    }

    if (user) {
      if (config.adminUsers.indexOf(user.id) >= 0) {
        ctx.isAdmin = true;
      }
      ctx.user = user;
    }

    await next();
  };
};
