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
    let result = await super.getCacheByParent(interface_id);

    if (!result) {
      result = await super.search({
        where: {
          interface_id,
        },
        orders: [['id', 'desc']],
      });

      result && (await super.setCacheByParent(interface_id, result));
    }

    return result;
  }
}

module.exports = DataMapService;
