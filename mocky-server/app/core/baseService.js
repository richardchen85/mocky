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
    this.getFields = [];
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

  async delete(id) {
    const result = await this.app.mysql.delete(this.tableName, { id });
    return result.affectedRows === 1;
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
    this.getFields.length &&
      Object.assign(options, {
        columns: this.getFields,
      });
    return await this.app.mysql.get(this.tableName, { id }, options);
  }

  async get(param, options = {}) {
    this.getFields.length &&
      Object.assign(options, {
        columns: this.getFields,
      });
    return await this.app.mysql.get(this.tableName, param, options);
  }

  async count(param) {
    return await this.app.mysql.count(this.tableName, param);
  }

  async query(param) {
    this.queryFields.length &&
      Object.assign(param, {
        columns: this.queryFields,
      });
    return await this.app.mysql.select(this.tableName, param);
  }
}

module.exports = BaseService;
