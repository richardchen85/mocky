'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/dataMap');
const messages = require('../common/messages');
const dataMapFroms = require('../common/dataMapFroms');

class DataMapController extends Controller {
  async create() {
    const { request, service, logger, user, validate } = this.ctx;
    const param = request.body;

    try {
      validate.call(this.ctx, validateRule.basic, param);
      if (param.from === dataMapFroms.none) {
        validate.call(this.ctx, validateRule.noFrom, param);
      } else {
        validate.call(this.ctx, validateRule.hasFrom, param);
      }
    } catch (e) {
      logger.error(e.errors);
      return this.fail(messages.common.paramError);
    }

    try {
      await service.dataMap.insert(Object.assign(param, {
        user_id: user.id,
        create_user: user.nickname,
      }));
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async remove() {
    const { request, service, logger, user } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      return this.fail(messages.common.paramError);
    }

    try {
      const savedMap = await service.dataMap.getById(id);
      if (!savedMap) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(savedMap.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(savedMap.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      await service.dataMap.deleteById(id);
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async update() {
    const { request, service, logger, user, validate } = this.ctx;
    const param = request.body;

    try {
      validate.call(this.ctx, validateRule.basic, param);
      if (param.from === dataMapFroms.none) {
        validate.call(this.ctx, validateRule.noFrom, param);
      } else {
        validate.call(this.ctx, validateRule.hasFrom, param);
      }
    } catch (e) {
      logger.error(e.errors);
      return this.fail(messages.common.paramError);
    }

    try {
      // check privilege
      const owned = await service.project.isOwner(param.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(param.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      await service.dataMap.update(param);
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async detail() {
    const { request, service, logger, user } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      return this.fail(messages.common.paramError);
    }

    try {
      const savedMap = await service.dataMap.getById(id);
      if (!savedMap) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(savedMap.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(savedMap.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      this.success(savedMap);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async list() {
    const { request, service, logger, user } = this.ctx;
    const interface_id = request.query.interface_id;

    if (!interface_id) {
      logger.warn(`url: ${request.url} interface_id is emptuy`);
      return this.fail(messages.common.paramError);
    }

    try {
      const savedItface = await service.interface.getById(interface_id);
      if (!savedItface) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(savedItface.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(savedItface.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      const maps = await service.dataMap.query({
        where: {
          interface_id,
        },
        orders: [
          [ 'id', 'desc' ],
        ],
      });
      this.success(maps);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = DataMapController;
