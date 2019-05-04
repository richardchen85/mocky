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
const cacheKeys = require('../common/cacheKeys');

class UserService extends BaseService {
  constructor(...args) {
    super(...args);
    this.tableName = 'mk_user';
    this.queryFields = ['id', 'email', 'nickname', 'status', 'create_time', 'update_time'];
  }

  async insert(user) {
    // 去首尾空格
    user.email = user.email.trim().toLowerCase();
    user.nickname = user.nickname.trim().toLowerCase();
    // 加密密码再入库
    user.password = this.ctx.helper.bHash(user.password);
    return await super.insert(user);
  }

  async update(user) {
    // 如果要更改密码，先加密
    if (user.password) {
      user.password = this.ctx.helper.bHash(user.password);
    }
    return await super.update(user);
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
    const results = await this.app.mysql.query(sql, [email, nickname]);
    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].email === email) return 1;
        if (results[i].nickname === nickname) return 2;
      }
    }
    return false;
  }

  /**
   * 用户登录操作
   * @param email email
   * @param password password
   * @return {Promise<{code: number, success: boolean}>} code: 0 正确，1 未注册，2：密码错误
   */
  async login(email, password) {
    email = email.trim().toLowerCase();
    const sql = `SELECT id,password FROM ${this.tableName} WHERE email=? AND status=?`;
    const user = await this.app.mysql.query(sql, [email, userStatus.NORMAL]);
    const existed = user[0];
    let validPassword = false;
    if (existed) {
      validPassword = this.ctx.helper.bCompare(password, existed.password);
    }
    return {
      success: validPassword,
      code: existed ? (validPassword ? 0 : 2) : 1,
      id: existed && existed.id,
    };
  }

  async getById(id) {
    const { redis } = this.app;
    const cacheKey = cacheKeys.USER(id);

    let user = await redis.get(cacheKey);
    if (user) {
      user = JSON.parse(user);
    } else {
      user = await super.getById(id);
      if (user) {
        await redis.set(cacheKey, JSON.stringify(user));
      }
    }
    return user;
  }

  async searchByNickname(key) {
    const sql = `
      SELECT ${this.queryFields.join(',')} FROM ${this.tableName} WHERE nickname LIKE ? ORDER BY id DESC LIMIT 0,10
    `;
    return await this.app.mysql.query(sql, [key + '%']);
  }

  /**
   * reset password
   * @param {String} email -
   * @param {String} newPass -
   * @return {Boolean} success -
   */
  async resetPass(email, newPass) {
    const { logger } = this.ctx;
    // 重复检查
    const savedUser = await super.search({ email, status: userStatus.NORMAL });
    if (savedUser.length === 0) {
      logger.warn(`无效用户 ${email} 重置密码`);
      return false;
    }

    savedUser[0].password = newPass;
    return await this.update(savedUser[0]);
  }
}

module.exports = UserService;
