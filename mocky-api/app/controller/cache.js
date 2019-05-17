'use strict';

const Controller = require('../core/baseController');
const messages = require('../common/messages');

class RedisController extends Controller {
  async set() {
    const { request, logger, service } = this.ctx;
    const { key, value } = request.body;

    if (!key || !value) {
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const result = await service.cache.set(key, value);
      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.paramError);
    }
  }

  async del() {
    const { request, logger, service } = this.ctx;
    const { keys } = request.body;

    if (!keys || keys.length === 0) {
      this.fail(messages.common.paramError);
      return;
    }

    try {
      keys.forEach(async key => {
        await service.cache.del(key);
      });
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.paramError);
    }
  }

  async get() {
    const { request, logger, service } = this.ctx;
    const { key } = request.query;

    if (!key) {
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const result = await service.cache.get(key);
      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.paramError);
    }
  }

  async keys() {
    const { request, logger, service } = this.ctx;
    const keyPrefix = this.app.config.redis.client.keyPrefix;
    let { pattern } = request.query;

    if (!pattern) {
      pattern = '*';
    }

    try {
      const result = await service.cache.keys(keyPrefix + pattern);
      this.success(
        result.map(key => {
          return key.replace(new RegExp('^' + keyPrefix), '');
        })
      );
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = RedisController;
