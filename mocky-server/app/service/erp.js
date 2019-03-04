'use strict';

/**
 * mock erp service
 */

const BaseService = require('../core/baseService');

module.exports = class ErpService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_erp';
  }

  async getByUID(user_id) {
    return await super.get({ user_id });
  }

  async searchByUserName(keyword) {
    return await this.app.mysql.query(`
      SELECT * FROM ${this.tableName} WHERE username like ?
    `, keyword + '%');
  }
};
