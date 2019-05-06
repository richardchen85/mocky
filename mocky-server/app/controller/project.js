'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/project');
const messages = require('../common/messages');

class ProjectController extends Controller {
  async save() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    if (!this.isValid(validateRule, param)) return;

    try {
      // has id, means update
      if (param.id) {
        // check privilege
        if (!(await this.ownerOrMemberOfProject(param.id))) return;

        await service.project.update(param);
      } else {
        param.id = await service.project.insert(
          Object.assign(param, {
            user_id: user.id,
            create_user: user.nickname,
          })
        );
      }

      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

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
      const savedProject = await service.project.getById(id);
      if (!savedProject || savedProject.user_id !== user.id) {
        this.fail(messages.common.notAllowed);
        return;
      }

      // check if has group
      const groups = await service.group.countByProject(id);
      if (groups) {
        this.fail('不能删除有分组的项目');
        return;
      }

      const result = await service.project.delete(savedProject);

      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async getById() {
    const { request, service, logger } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      // check privilege
      if (!(await this.ownerOrMemberOfProject(id))) return;

      const project = await service.project.getById(id);
      if (!project) {
        this.fail(messages.common.notFound);
        return;
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
      const projects = await service.project.getByUser(id);

      this.success(projects);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 项目详情页
   */
  async detail() {
    const { request, service, logger } = this.ctx;
    const id = request.query.id;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      // check privilege
      if (!(await this.ownerOrMemberOfProject(id))) return;

      // get project
      const project = await service.project.getById(id);
      if (!project) {
        this.fail(messages.common.notFound);
        return;
      }

      const pGroup = service.group.getByProject(project.id);
      const pItf = service.interface.getByProject(project.id);
      const [groups, interfaces] = await Promise.all([pGroup, pItf]);

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

  /**
   * owner 转移
   */
  async transfer() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;
    const { project_id, user_id } = param;
    const rule = {
      project_id: 'number',
      user_id: 'number',
    };

    if (!this.isValid(rule, param)) return;

    try {
      const savedProject = await service.project.getById(project_id);

      if (!savedProject) {
        this.fail(messages.common.notFound);
        return;
      }

      // 只有 owner 可以转移
      if (savedProject.user_id !== user.id) {
        this.fail(messages.common.notAllowed);
        return;
      }

      const result = await service.project.transfer(project_id, user_id);

      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = ProjectController;
