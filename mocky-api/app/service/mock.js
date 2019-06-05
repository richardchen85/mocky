'use strict';

/**
 * mock data service
 */

const BaseService = require('../core/baseService');
const cacheKeys = require('../common/cacheKeys');

module.exports = class MockService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_mock';
    this.updateFields = ['name', 'status_code', 'mock_js', 'body'];
    this.cacheKeyFn = cacheKeys.mock;
    this.cacheKeyByParentFn = cacheKeys.mockByInterface;
    this.parentIdName = 'interface_id';
  }

  async insert(model) {
    const trans = await this.app.mysql.beginTransaction();
    const body = model.body;

    delete model.body;

    try {
      const mock_id = await super.insert(model, trans);
      const bodyRows = await this.ctx.service.mockBody.insert({ ...model, id: mock_id, body }, trans);

      await trans.commit();

      return mock_id;
    } catch (err) {
      await trans.rollback();
      throw err;
    }
  }

  async update(model) {
    const { service } = this.ctx;
    const saved = await this.getById(model.id);

    if (saved.body !== model.body) {
      saved.body = model.body;
      delete model.body;
      const trans = await this.app.mysql.beginTransaction();

      try {
        await service.mockBody.deleteByMock(trans, model.id);
        await service.mockBody.insert(saved, trans);

        const result = await super.update(model, undefined, trans);
        await trans.commit();

        return result;
      } catch (err) {
        await trans.rollback();
        throw err;
      }
    } else {
      //delete model.body;
      return await super.update(model);
    }
  }

  async getById(id) {
    let result = await this.getCache(id);

    if (result) return result;

    result = await super.getById(id);

    if (result) {
      await this.deleteCache(id);
      result.body = await this.ctx.service.mockBody.getByMock(id);
      await this.setCache(result);
    }

    return result;
  }

  async getByInterface(interface_id) {
    let results = await this.getCacheByParent(interface_id);

    if (!results) {
      results = await this.search({
        where: {
          interface_id,
        },
        orders: [['id', 'desc']],
      });

      if (results.length > 0) {
        const mockIds = results.map(item => item.id);
        const mockBodies = await this.ctx.service.mockBody.batchGetByMocks(mockIds);
        results.forEach(item => {
          item.body = mockBodies.get(item.id) || '';
        });
      }

      await super.setCacheByParent(interface_id, results);
    }

    return results;
  }
};
