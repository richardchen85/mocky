'use strict';

/**
 * interface mock data map
 */

const BaseService = require('../core/baseService');

class DataMapService extends BaseService {
  constructor(args) {
    super(args);

    this.tableName = 'mk_data_map';
    this.updateFields = ['name', 'from', 'match', 'regex', 'mock_id'];
  }

  getByInterface(interface_id) {
    return super.query({
      where: {
        interface_id,
      },
    });
  }
}

module.exports = DataMapService;
