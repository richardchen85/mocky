'use strict';

/**
 * mock group service
 */

const BaseService = require('../core/baseService');

module.exports = class GroupService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_group';
    this.updateFields = ['name', 'desc', 'priority'];
  }

  getByProject(project_id) {
    return super.query({
      where: {
        project_id,
      },
      orders: [['priority', 'ASC']],
    });
  }

  countByProject(project_id) {
    return super.count({
      project_id,
    });
  }
};
