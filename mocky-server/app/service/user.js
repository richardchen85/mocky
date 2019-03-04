/**
 * user service
 * @example User
 * {
 *   id: 'int',
 *   email: 'email',
 *   nickname: 'string',
 *   password: 'string',
 *   status: 'int', // 0: disabled, 1: enabled
 *   create_time: 'timestamp',
 *   update_time: 'timestamp'
 * }
 */

'use strict';

const BaseService = require('../core/baseService');
const userStatus = require('../common/userStatus');

const filterFields = [ 'password', 'create_time', 'update_time', 'status' ];
const userInfoFilter = user => {
  filterFields.forEach(field => {
    delete user[field];
  });
  return user;
};

class UserService extends BaseService {
  constructor(...args) {
    super(...args);
    this.tableName = 'mk_user';
  }

  async insert(user) {
    // 去首尾空格
    user.email = user.email.trim().toLowerCase();
    user.nickname = user.nickname.trim().toLowerCase();
    // 加密密码再入库
    user.password = this.ctx.helper.bHash(user.password);
    return await super.insert(user);
  }

  async delete(param) {
    return await super.deleteLogic(param);
  }

  async update(user) {
    // 如果要更改密码，先加密
    if (user.password) {
      user.password = this.ctx.helper.bHash(user.password);
    }
    return await super.update(user);
  }

  async getById(id) {
    const user = await super.getById(id);
    if (user) {
      userInfoFilter(user);
    }
    return user;
  }

  /**
   * 检查 email 和 nickname 是否存在
   * @param {*} email email
   * @param {*} nickname nickname
   * @return {*} false：不存在，1：email 存在，2：nickname 存在
   */
  async checkExists(email, nickname) {
    email = email.trim().toLowerCase();
    nickname = nickname.trim().toLowerCase();
    const sql = `
      SELECT email,nickname FROM ${this.tableName} WHERE email=? OR nickname=?
    `;
    const results = await this.app.mysql.query(sql, [ email, nickname ]);
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].email === email) return 1;
        if (results[i].nickname === nickname) return 2;
      }
    }
    return false;
  }

  async login(email, password) {
    email = email.trim().toLowerCase();
    const user = await this.app.mysql.get(this.tableName, { email, status: userStatus.NORMAL });
    let validPassword = false;
    if (user) {
      validPassword = this.ctx.helper.bCompare(password, user.password);
    }
    return {
      success: validPassword,
      code: user ? (validPassword ? 0 : 2) : 1,
      user: user ? userInfoFilter(user) : null,
    };
  }

  async query(param) {
    const users = await super.query(param);
    if (users && users.length > 0) {
      users.forEach(user => {
        userInfoFilter(user);
      });
    }
    return users;
  }

  async search(key) {
    const sql = `SELECT * FROM ${this.tableName} WHERE nickname LIKE ? ORDER BY id DESC`;
    const users = await this.app.mysql.query(sql, [ key + '%' ]);
    return users.map(user => userInfoFilter(user));
  }
}

module.exports = UserService;
