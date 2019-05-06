'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/mock');
const messages = require('../common/messages');

class MockController extends Controller {
  /**
   * POST /mock/save
   */
  async save() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    // 去掉换行和空格
    param.body = param.body.replace(/(\r?\n)|\s/g, '');

    if (!this.isValid(validateRule, param)) return;

    try {
      // check privilege
      if (!(await this.ownerOrMemberOfProject(param.project_id))) return;

      let result;
      if (param.id) {
        result = await service.mock.update(param);
      } else {
        result = await service.mock.insert(
          Object.assign(param, {
            user_id: user.id,
            create_user: user.nickname,
          })
        );
      }

      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * GET /mock/delete?id=xxx
   */
  async delete() {
    const { request, service, logger } = this.ctx;
    const { id } = request.query;

    if (!id) {
      logger.warn(`url: ${request.url} id is empty!`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const savedMock = await service.mock.getById(id);
      if (!savedMock) {
        this.fail(messages.common.notFound);
        return;
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(savedMock.project_id))) return;

      const result = await service.mock.delete(savedMock);
      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * GET /mock/detail?id=xxx
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
      const savedMock = await service.mock.getById(id);
      if (!savedMock) {
        this.fail(messages.common.notFound);
        return;
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(savedMock.project_id))) return;

      this.success(savedMock);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * GET /mock/list?interface_id=xxx
   */
  async list() {
    const { request, service, logger } = this.ctx;
    const interface_id = request.query.interface_id;

    if (!interface_id) {
      logger.warn(`url: ${request.url} interface_id is emptuy`);
      this.fail(messages.common.paramError);
      return;
    }

    try {
      const savedItface = await service.interface.getById(interface_id);
      if (!savedItface) {
        this.fail(messages.common.notFound);
        return;
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(savedItface.project_id))) return;

      const mocks = await service.mock.search({
        where: {
          interface_id,
        },
        orders: [['id', 'desc']],
      });
      this.success(mocks);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = MockController;
