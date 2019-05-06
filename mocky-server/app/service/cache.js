'use strict';

const { Service } = require('egg');
const redisExpires = 60 * 60 * 2;

class CacheService extends Service {
  async set(key, value) {
    return await this.app.redis.setex(key, redisExpires, value);
  }

  async del(key) {
    return await this.app.redis.del(key);
  }

  async get(key) {
    return await this.app.redis.get(key);
  }

  async keys(pattern) {
    return await this.app.redis.keys(pattern);
  }
}

module.exports = CacheService;
