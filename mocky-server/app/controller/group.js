'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/group');
const messages = require('../common/messages');

class GroupController extends Controller {
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
      await service.group.insert(Object.assign(param, {
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
      const savedGroup = await service.group.getById(id);
      if (!savedGroup) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(savedGroup.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(savedGroup.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      // check if has interface
      const itfaces = await service.interface.countByGroup(id);
      if (itfaces) {
        return this.fail('group is not empty');
      }

      await service.group.deleteById(id);
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
      // check privilege
      const owned = await service.project.isOwner(param.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(param.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      await service.group.update(param);
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
      const savedGroup = await service.group.getById(id);
      if (!savedGroup) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(savedGroup.project_id, user.id);
      if (!owned) {
        const member = await service.member.isMember(savedGroup.project_id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      this.success(savedGroup);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 排序
   * post /group/sort body: { ids: [] }
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
        await service.group.update({ id: parseInt(ids[i], 10), priority: i + 1 });
      }
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = GroupController;
