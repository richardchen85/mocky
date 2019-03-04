'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/interface');
const messages = require('../common/messages');

class InterfaceController extends Controller {
  async create() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    try {
      this.ctx.validate(validateRule, param);
    } catch (e) {
      logger.error(e.errors);
      return this.fail(messages.common.paramError);
    }

    try {
      await service.interface.insert(Object.assign(param, {
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
      const savedItface = await service.interface.getById(id);
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

      // check empty
      let mocks,
        dataMaps;
      await Promise.all([
        service.mock.getByInterface(id),
        service.dataMap.getByInterface(id),
      ]).then(values => {
        mocks = values[0];
        dataMaps = values[1];
      });
      if (mocks.length > 0 || dataMaps.length > 0) {
        return this.fail('interface is not empty');
      }

      await service.interface.deleteById(id);
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async update() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    try {
      this.ctx.validate(validateRule, param);
    } catch (e) {
      logger.error(e.errors);
      return this.fail(messages.common.paramError);
    }

    try {
      const savedItface = await service.interface.getById(param.id);
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

      await service.interface.update(param);
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
      const itface = await service.interface.getById(id);
      if (!itface) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(itface.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(itface.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      this.success(itface);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 排序
   * post /interface/sort body: { ids: [] }
   */
  async sort() {
    const { request, service, logger } = this.ctx;
    const ids = request.body.ids;

    if (!ids || ids.length < 1) {
      this.success();
      return;
    }

    try {
      for (let i = 0; i < ids.length; i++) {
        await service.interface.update({ id: parseInt(ids[i], 10), priority: i + 1 });
      }
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = InterfaceController;
