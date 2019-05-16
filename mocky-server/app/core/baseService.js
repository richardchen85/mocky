/**
 * base service
 */

'use strict';

const { Service } = require('egg');

/**
 * 将二维数组转换成CASE WHEN THEN的批量更新条件
 * @param {Array} datas 二维数组
 * @param {String} field 列名
 * @return {String} sql语句
 */
function parseUpdate(datas, field) {
  const keys = Object.keys(datas[0]);
  const updates = [];
  keys.forEach(key => {
    let cases = `${key} = CASE ${field} `;
    datas.forEach(data => {
      cases += `WHEN ${data[field]} THEN ${data[key]} `;
    });
    cases += ' END';
    updates.push(cases);
  });
  return updates.join();
}

/**
 * 解析where条件
 * @param {Object} params -
 * @return {String} 条件
 */
function parseParams(params) {
  const wheres = [];
  Object.keys(params).forEach(key => {
    wheres.push(`${key}=${params[key]}`);
  });
  return wheres.length > 0 ? ' AND ' + wheres.join(' AND ') : '';
}

class BaseService extends Service {
  constructor(args) {
    super(args);
    this.tableName = '';
    this.insertFields = [];
    this.updateFields = [];
    this.queryFields = [];
    this.cacheKeyFn = null;
    this.cacheKeyByParentFn = null;
    this.parentIdName = '';
  }

  async setCache(model) {
    if (this.cacheKeyFn) {
      await this.service.cache.set(this.cacheKeyFn(model.id), JSON.stringify(model));
    }
  }

  async deleteCache(id) {
    if (this.cacheKeyFn) {
      await this.service.cache.del(this.cacheKeyFn(id));
    }
  }

  async getCache(id) {
    let cached;
    if (this.cacheKeyFn) {
      cached = await this.service.cache.get(this.cacheKeyFn(id));
      if (cached) {
        cached = JSON.parse(cached);
      }
    }
    return cached;
  }

  async setCacheByParent(parent_id, models) {
    if (this.cacheKeyByParentFn) {
      await this.service.cache.set(this.cacheKeyByParentFn(parent_id), JSON.stringify(models));
    }
  }

  async deleteCacheByParent(model) {
    if (this.cacheKeyByParentFn) {
      await this.service.cache.del(this.cacheKeyByParentFn(model[this.parentIdName]));
    }
  }

  async getCacheByParent(parent_id) {
    let cached;
    if (this.cacheKeyByParentFn) {
      cached = await this.service.cache.get(this.cacheKeyByParentFn(parent_id));
      if (cached) {
        cached = JSON.parse(cached);
      }
    }
    return cached;
  }

  /**
   * return properties of model those existed in fields array
   * @param {Object} model model
   * @param {Array} fields fields
   * @return {Object} existed fields
   */
  fieldFilter(model, fields) {
    if (!fields || fields.length === 0) return model;

    const newModel = {};
    Object.keys(model)
      .filter(key => {
        return fields.includes(key);
      })
      .forEach(key => {
        newModel[key] = model[key];
      });
    return newModel;
  }

  /**
   * insert a model
   * @param {*} model model
   * @return {Number} autoincrement id
   */
  async insert(model) {
    await this.deleteCacheByParent(model);

    model = this.fieldFilter(model, this.insertFields);

    const result = await this.app.mysql.insert(this.tableName, model);
    return result.affectedRows === 1 ? result.insertId : 0;
  }

  async delete(model) {
    await Promise.all([this.deleteCache(model.id), this.deleteCacheByParent(model)]);

    const result = await this.app.mysql.delete(this.tableName, { id: model.id });
    return result.affectedRows === 1;
  }

  async update(model, options = { where: {} }) {
    await Promise.all([this.deleteCache(model.id), this.deleteCacheByParent(model)]);

    Object.assign(options.where, {
      id: model.id,
    });
    model = this.fieldFilter(model, this.updateFields);

    const result = await this.app.mysql.update(this.tableName, model, options);
    return result.affectedRows === 1;
  }

  async batchUpdate(datas, field, params) {
    const updates = parseUpdate(datas, field);
    const wheres = params ? parseParams(params) : '';
    const fields = datas.map(data => data[field]);

    // delete caches
    const saved = await this.search({
      where: Object.assign({}, params, {
        [field]: fields,
      }),
    });
    saved.forEach(async item => {
      await Promise.all([this.deleteCache(item.id), this.deleteCacheByParent(item)]);
    });

    const sql = `
      UPDATE ${this.tableName} SET
        ${updates}
      WHERE ${field} IN (${fields}) ${wheres}
    `;
    const result = await this.app.mysql.query(sql);
    return result.affectedRows;
  }

  async getById(id) {
    let result = await this.getCache(id);

    if (result) return result;

    const options = {};
    this.queryFields.length &&
      Object.assign(options, {
        columns: this.queryFields,
      });
    result = await this.app.mysql.get(this.tableName, { id }, options);

    result && (await this.setCache(result));

    return result;
  }

  async count(conditions) {
    return await this.app.mysql.count(this.tableName, conditions);
  }

  async search(conditions) {
    this.queryFields.length &&
      Object.assign(conditions, {
        columns: this.queryFields,
      });
    return await this.app.mysql.select(this.tableName, conditions);
  }
}

module.exports = BaseService;
