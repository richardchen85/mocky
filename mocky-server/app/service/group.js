'use strict';

/**
 * mock group service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class GroupService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_group';
    this.updateFields = ['name', 'desc', 'priority'];
    this.cacheKeyFn = cacheKeys.group;
    this.cacheKeyByParentFn = cacheKeys.groupByProject;
    this.parentIdName = 'project_id';
  }

  async getByProject(project_id) {
    let result = await super.getCacheByParent(project_id);

    if (!result) {
      result = await super.search({
        where: {
          project_id,
        },
        orders: [['priority', 'ASC']],
      });

      result.length > 0 && await super.setCacheByParent(result);
    }

    return result;
  }

  countByProject(project_id) {
    return super.count({
      project_id,
    });
  }

  async sort(ids, project_id) {
    const datas = ids.map((id, index) => ({ id, priority: index + 1 }));
    return await super.batchUpdate(datas, 'id', { project_id });
  }
};
