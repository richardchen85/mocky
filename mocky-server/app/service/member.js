'use strict';

/**
 * mock member service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class ProjectService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_member';
    this.cacheKeyByParentFn = cacheKeys.memberByProject;
    this.parentIdName = 'project_id';
  }

  /**
   * batch insert members of project
   * @param {Object} trans transaction
   * @param {Number} project_id project id
   * @param {Array} values members
   * @return {Object} Promise
   */
  async insertByTransaction(trans, project_id, values) {
    values = values.map(m => [project_id, m]);
    return trans.query(`INSERT INTO ${this.tableName} (project_id, user_id) VALUES ?`, [values]);
  }

  /**
   * sync project's member
   * @param {Object} trans transaction
   * @param {Number} project_id project id
   * @param {Array} members members
   */
  async syncByProject(trans, project_id, members) {
    await super.deleteCacheByParent({ project_id });

    // get saved members
    const saved = await super.search({
      where: {
        project_id,
      },
    });

    // get added
    const added = [];
    members.forEach(m => {
      if (saved.filter(s => s.user_id === m).length === 0) {
        added.push([project_id, m]);
      }
    });

    // get deleted
    let deleted = [];
    if (members.length === 0) {
      deleted = saved.map(u => u.user_id);
    } else {
      saved.forEach(s => {
        if (members.filter(m => m === s.user_id).length === 0) {
          deleted.push(s.user_id);
        }
      });
    }

    if (deleted.length > 0) {
      await trans.query(`DELETE FROM ${this.tableName} WHERE user_id in (?)`, deleted);
    }
    if (added.length > 0) {
      await trans.query(`INSERT INTO ${this.tableName} (project_id, user_id) VALUES ?`, [added]);
    }
  }

  async getByProject(project_id) {
    let result = await super.getCacheByParent(project_id);

    if (!result) {
      result = await super.search({
        where: {
          project_id,
        },
      });

      result && (await super.setCacheByParent(project_id, result));
    }

    return result;
  }

  async deleteByProject(trans, project_id) {
    await super.deleteCacheByParent({ project_id });
    return trans.delete(this.tableName, { project_id });
  }
};
