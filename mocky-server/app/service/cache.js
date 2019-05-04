'use strict';

const Service = require('egg').Service;
const cacheKeys = require('../common/cacheKeys');

module.exports = class CacheService extends Service {
  async setObject(key, object) {
    return this.ctx.app.redis.set(key, JSON.stringify(object));
  }

  async getObject(key) {
    const value = await this.ctx.redis.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  /**
   * email verify code
   * =====================================
   */

  async setEmailVerifyCode(email, type, code) {
    const key = cacheKeys.EMAIL_VERIFY_PREFIX(email, type);
    const expires = 60 * 60 * 24;
    return this.ctx.app.redis.setex(key, expires, code);
  }

  async getEmailVerifyCode(email, type) {
    return this.ctx.app.redis.get(cacheKeys.EMAIL_VERIFY_PREFIX(email, type));
  }

  /**
   * user
   * =====================================
   */

  async setUser(user) {
    return this.setObject(cacheKeys.USER(user.id), user);
  }

  async delUser(id) {
    return this.ctx.app.redis.del(cacheKeys.USER(id));
  }

  async getUser(id) {
    return this.getObject(cacheKeys.USER(id));
  }

  /**
   * project
   * =====================================
   */

  async setProject(project) {
    return this.setObject(cacheKeys.PROJECT(project.id), project);
  }

  async delProject(id) {
    return this.ctx.app.redis.del(cacheKeys.PROJECT(id));
  }

  async getProject(id) {
    return this.getObject(cacheKeys.PROJECT(id));
  }
}
