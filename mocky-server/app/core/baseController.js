/**
 * base controller
 */

'use strict';

const { Controller } = require('egg');
const messages = require('../common/messages');

class BaseController extends Controller {
  /**
   * 返回成功 json
   * @param {Object} data 数据
   * @param {Number} code statusCode
   */
  success(data = null, code = 200) {
    this.ctx.body = {
      success: true,
      data,
      code,
    };
  }

  /**
   * 返回失败 json
   * @param {String} message 失败消息
   * @param {Number} code statusCode
   */
  fail(message, code = 500) {
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

    // 超管用户，拥有所有权限
    if (this.ctx.isAdmin) return true;

    if (!(await service.project.ownerOrMember(project_id, user.id))) {
      this.fail(messages.common.notAllowed);
      return false;
    }
    return true;
  }
}

module.exports = BaseController;
