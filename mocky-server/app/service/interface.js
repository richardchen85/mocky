'use strict';

/**
 * mock interface service
 */

const BaseService = require('../core/baseService');

module.exports = class InterfaceService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_interface';
    this.updateFields = ['name', 'url', 'method', 'content_type', 'jsonp_callback', 'desc', 'priority'];
  }

  countByGroup(group_id) {
    return super.count({ group_id });
  }

  getByProject(project_id) {
    return super.query({
      where: {
        project_id,
      },
      orders: [['priority', 'ASC']],
    });
  }
};
