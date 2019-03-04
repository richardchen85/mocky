'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/project');
const messages = require('../common/messages');

class ProjectController extends Controller {
  /**
   * post /project/save
   */
  async save() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    try {
      this.ctx.validate(validateRule, param);
    } catch (e) {
      logger.error(e.errors);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      // has id, means update
      if (param.id) {
        // check privilege
        const owned = await service.project.isOwner(param.id, user.id);
        if (!owned) {
          const member = await service.member.isMember(param.id, user.id);
          if (!member) {
            this.fail(messages.common.notAllowed);
            return;
          }
        }

        await service.project.update(param);
      } else {
        await service.project.insert(Object.assign(param, {
          user_id: user.id,
          create_user: user.nickname,
        }));
      }

      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * get /project/delete query: id=1
   */
  async delete() {
    const { request, service, logger, user } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      // only owner can remove project
      const owned = await service.project.isOwner(id, user.id);
      if (!owned) {
        this.fail(messages.common.notAllowed);
        return;
      }

      // check if has group
      const groups = await service.group.countByProject(id);
      if (groups) {
        this.fail('project is not empty');
        return;
      }

      await service.project.deleteById(id);
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * get /project/getById query: id=1
   */
  async getById() {
    const { request, service, logger, user } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      // get project
      const project = await service.project.getById(id);
      if (!project) {
        this.fail(messages.common.notFound);
        return;
      }

      // check privilege
      let memberIds = await service.member.getByProject(project.id);
      memberIds = memberIds.map(m => m.user_id);
      const isMember = memberIds.includes(user.id);
      if (user.id !== project.user_id && isMember) {
        this.fail(messages.common.notAllowed);
        return;
      }

      // get owner and members
      project.owner = await service.user.getById(project.user_id);
      if (memberIds.length > 0) {
        project.members = await service.user.query({
          where: {
            id: memberIds,
          },
        });
      } else {
        project.members = [];
      }

      this.success(project);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 获取用户拥有和参与的项目
   */
  async getByUser() {
    const { service, logger, user } = this.ctx;
    const id = user.id;

    try {
      let owned,
        joined;

      await Promise.all([
        service.project.owned(id),
        service.project.joined(id),
      ]).then(values => {
        owned = values[0];
        joined = values[1];
      });

      joined.forEach(p1 => {
        if (p1.user_id !== id) {
          owned.push(p1);
        }
      });

      if (owned.length > 0) {
        const ownerIds = owned.map(p => p.user_id);
        const owners = await service.user.query({
          where: {
            id: ownerIds,
          },
        });
        owned.forEach(p => {
          p.owner = owners.find(u => u.id === p.user_id);
        });
      }

      this.success(owned);
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
      // get project
      const project = await service.project.getById(id);
      if (!project) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      const owned = await service.project.isOwner(project.id, user.id);
      if (!owned) {
        const member = await service.member.isMember(project.id, user.id);
        if (!member) {
          return this.fail(messages.common.notAllowed);
        }
      }

      // get group
      let groups = [];
      // get interface
      let interfaces = [];
      await Promise.all([
        service.group.getByProject(project.id),
        service.interface.getByProject(project.id),
      ]).then(values => {
        groups = values[0];
        interfaces = values[1];
      });
      groups.forEach(group => {
        group.interfaces = interfaces.filter(itf => itf.group_id === group.id);
      });
      project.groups = groups;

      this.success(project);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = ProjectController;
