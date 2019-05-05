'use strict';

/**
 * mock data service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class MockService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_mock';
    this.updateFields = ['name', 'status_code', 'mock_js', 'body'];
    this.queryFields = ['id', 'user_id', 'project_id', 'interface_id', 'name', 'status_code', 'create_user'];
    this.cacheKeyFn = cacheKeys.mock;
    this.cacheKeyByParentFn = cacheKeys.mockByInterface;
    this.parentIdName = 'interface_id';
  }

  async getByInterface(interface_id) {
    let result = super.getCacheByParent(interface_id);

    if (!result) {
      result = super.search({
        where: {
          interface_id,
        },
      });

      result.length > 0 && (await super.setCacheByParent(result));
    }

    return result;
  }
};
