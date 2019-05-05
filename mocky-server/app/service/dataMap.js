'use strict';

/**
 * interface mock data map
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

class DataMapService extends BaseService {
  constructor(args) {
    super(args);

    this.tableName = 'mk_data_map';
    this.updateFields = ['name', 'from', 'match', 'regex', 'mock_id'];
    this.cacheKeyFn = cacheKeys.dataMap;
    this.cacheKeyByParentFn = cacheKeys.dataMapByInterface;
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

      result.length > 0 && await super.setCacheByParent(result);
    }

    return result;
  }
}

module.exports = DataMapService;
