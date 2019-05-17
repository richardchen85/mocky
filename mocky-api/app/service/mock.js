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
    this.cacheKeyFn = cacheKeys.mock;
    this.cacheKeyByParentFn = cacheKeys.mockByInterface;
    this.parentIdName = 'interface_id';
  }

  async getByInterface(interface_id) {
    let result = await super.getCacheByParent(interface_id);

    if (!result) {
      result = await super.search({
        where: {
          interface_id,
        },
      });

      result && (await super.setCacheByParent(interface_id, result));
    }

    return result;
  }
};
