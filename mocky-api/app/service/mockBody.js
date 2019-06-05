'use strict';

/**
 * mock data service
 */

const BaseService = require('../core/baseService');

module.exports = class MockService extends BaseService {
  constructor(args) {
    super(args);
    this.tableName = 'mk_mock_body';
  }

  async insert({ user_id, id, body }, trans) {
    const rows = this.ctx.helper.cutString(body, 5000).map(piece => {
      return {
        user_id,
        mock_id: id,
        body: piece,
      };
    });
    return (await trans.insert(this.tableName, rows)).affectedRows >= 1;
  }

  async deleteByMock(trans, mock_id) {
    return trans.delete(this.tableName, { mock_id });
  }

  async getByMock(mock_id) {
    const results = await super.search({ where: { mock_id } });
    if (results.length > 0) {
      return results.map(item => item.body).join('');
    }
    return '';
  }

  /**
   * 批量查询 mock 内容
   * @param mocks
   * @return {Promise<Map>} Map<mock_id,body>
   */
  async batchGetByMocks(mocks) {
    const sql = `SELECT * FROM ${this.tableName} WHERE mock_id in (?)`;
    const rows = await this.ctx.app.mysql.query(sql, [mocks]);
    const results = new Map();
    rows.forEach(row => {
      results.set(row.mock_id, (results.get(row.mock_id) || '') + row.body);
    });
    return results;
  }
};
