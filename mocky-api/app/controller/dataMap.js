'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/dataMap');
const messages = require('../common/messages');
const dataMapFroms = require('../common/dataMapFroms');

class DataMapController extends Controller {
  async save() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;
    const { basic, noFrom, hasFrom } = validateRule;
    const rules =
      param.from === dataMapFroms.none ? Object.assign({}, basic, noFrom) : Object.assign({}, basic, hasFrom);

    if (!this.isValid(rules, param)) return;

    try {
      // check privilege
      if (!(await this.ownerOrMemberOfProject(param.project_id))) return;

      let result;
      if (param.id) {
        result = await service.dataMap.update(param);
      } else {
        result = await service.dataMap.insert(
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

  async delete() {
    const { request, service, logger } = this.ctx;
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
      if (!(await this.ownerOrMemberOfProject(savedMap.project_id))) return;

      const result = await service.dataMap.delete(savedMap);
      this.success(result);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async detail() {
    const { request, service, logger } = this.ctx;
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
      if (!(await this.ownerOrMemberOfProject(savedMap.project_id))) return;

      this.success(savedMap);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  async list() {
    const { request, service, logger } = this.ctx;
    const interface_id = request.query.interface_id;

    if (!interface_id) {
      logger.warn(`url: ${request.url} interface_id is empty`);
      return this.fail(messages.common.paramError);
    }

    try {
      const savedItface = await service.interface.getById(interface_id);
      if (!savedItface) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(savedItface.project_id))) return;

      const maps = await service.dataMap.getByInterface(interface_id);
      this.success(maps);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }
}

module.exports = DataMapController;
