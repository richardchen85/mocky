/**
 * base controller
 */

'use strict';

const { Controller } = require('egg');

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
}

module.exports = BaseController;
