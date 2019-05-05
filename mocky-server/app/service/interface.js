'use strict';

/**
 * mock interface service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class InterfaceService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_interface';
    this.updateFields = ['group_id', 'name', 'url', 'method', 'content_type', 'jsonp_callback', 'desc', 'priority'];
    this.cacheKeyFn = cacheKeys.interface;
    this.cacheKeyByParentFn = cacheKeys.interfaceByProject;
    this.parentIdName = 'project_id';
  }

  countByGroup(group_id) {
    return super.count({ group_id });
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

  async sort(ids, project_id) {
    const datas = ids.map((id, index) => ({ id, priority: index + 1 }));
    return await super.batchUpdate(datas, 'id', { project_id });
  }
};
