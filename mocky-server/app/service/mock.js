'use strict';

/**
 * mock data service
 */

const BaseService = require('../core/baseService');

module.exports = class MockService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_mock';
    this.updateFields = [ 'name', 'status_code', 'body' ];
    this.queryFields = [ 'id', 'user_id', 'project_id', 'interface_id', 'name', 'status_code', 'create_user' ];
  }

  getByInterface(interface_id) {
    return super.query({
      where: {
        interface_id,
      },
    });
  }
};
