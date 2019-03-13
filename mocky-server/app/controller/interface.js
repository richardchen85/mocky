'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/interface');
const messages = require('../common/messages');

class InterfaceController extends Controller {
  async save() {
    const { request, service, logger, user } = this.ctx;
    const param = request.body;

    if (!this.isValid(validateRule, param)) return;

    try {
      // check privilege
      if (!(await this.ownerOrMemberOfProject(param.project_id))) return;
      // check group_id
      if (!(await this.checkGroup(param))) return;

      let result;
      if (param.id) {
        result = await service.interface.update(param);
      } else {
        result = await service.interface.insert(
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
      const savedItface = await service.interface.getById(id);
      if (!savedItface) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(savedItface.project_id))) return;

      // check empty
      let mocks = [];
      let dataMaps = [];
      await Promise.all([service.mock.getByInterface(id), service.dataMap.getByInterface(id)]).then(values => {
        mocks = values[0];
        dataMaps = values[1];
      });
      if (mocks.length > 0 || dataMaps.length > 0) {
        return this.fail('不能删除有映射规则和模拟数据的接口');
      }

      await service.interface.delete(id);
      this.success();
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
      const itface = await service.interface.getById(id);
      if (!itface) {
        return this.fail(messages.common.notFound);
      }

      // check privilege
      if (!(await this.ownerOrMemberOfProject(itface.project_id))) return;

      this.success(itface);
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 排序
   * post /interface/sort
   * body: { ids: [] }
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
        await service.interface.update({
          id: parseInt(ids[i], 10),
          priority: i + 1,
        });
      }
      this.success();
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 检查 group_id 是否属于当前 interface 的项目
   * @param {Object} itf 接口
   * @return {Promise} boolean
   */
  async checkGroup(itf) {
    const { service, logger } = this.ctx;
    let groupCount = 0;
    try {
      groupCount = await service.group.count({
        id: itf.group_id,
        project_id: itf.project_id,
      });
    } catch (e) {
      logger.error(e);
    }
    if (groupCount === 0) {
      this.fail('请选择正确的分组');
      return false;
    }
    return true;
  }
}

module.exports = InterfaceController;
