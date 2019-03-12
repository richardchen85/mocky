/**
 * base controller
 */

'use strict';

const { Controller } = require('egg');
const messages = require('../common/messages');

class BaseController extends Controller {
  success(data, code) {
    this.ctx.body = {
      success: true,
      data,
      code,
    };
  }

  fail(message, code) {
    this.ctx.body = {
      success: false,
      message,
      code,
    };
  }

  /**
   * 校验参数是否符合指定规则
   * @param {Object} rules Parameters 验证规则
   * @param {Object} params 参数
   * @return {boolean} -
   */
  isValid(rules, params) {
    const { logger } = this.ctx;
    try {
      this.ctx.validate(rules, params);
      return true;
    } catch (e) {
      logger.error(e.errors);
      const firstError = e.errors[0];
      this.fail(firstError ? `${firstError.field} ${firstError.message}` : messages.common.paramError);
      return false;
    }
  }

  /**
   * 当前用户是否项目 owner 或参与者
   * @param {Number} project_id 项目 id
   * @return {Promise<*>} boolean
   */
  async ownerOrMemberOfProject(project_id) {
    const { service, user } = this.ctx;
    if (!(await service.project.ownerOrMember(project_id, user.id))) {
      this.fail(messages.common.notAllowed);
      return false;
    }
    return true;
  }
}

module.exports = BaseController;
