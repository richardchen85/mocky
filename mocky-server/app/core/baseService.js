/**
 * base service
 */

'use strict';

const { Service } = require('egg');

class BaseService extends Service {
  constructor(args) {
    super(args);
    this.tableName = '';
    this.insertFields = [];
    this.updateFields = [];
    this.queryFields = [];
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
    model = this.fieldFilter(model, this.insertFields);
    const result = await this.app.mysql.insert(this.tableName, model);
    return result.affectedRows === 1 ? result.insertId : 0;
  }

  async deleteById(id) {
    const result = await this.app.mysql.delete(this.tableName, { id });
    return result.affectedRows === 1;
  }

  async deleteByConditions(conditions) {
    const result = await this.app.mysql.delete(this.tableName, conditions);
  }

  async update(model, options = { where: {} }) {
    Object.assign(options.where, {
      id: model.id,
    });
    model = this.fieldFilter(model, this.updateFields);
    const result = await this.app.mysql.update(this.tableName, model, options);
    return result.affectedRows === 1;
  }

  async getById(id) {
    const options = {};
    this.queryFields.length &&
      Object.assign(options, {
        columns: this.queryFields,
      });
    return await this.app.mysql.get(this.tableName, { id }, options);
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
