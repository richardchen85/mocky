'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  bHash(str) {
    return bcrypt.hashSync(str, 10);
  },
  bCompare(str, hash) {
    return bcrypt.compareSync(str, hash);
  },
  /**
   * 是否在过滤器中
   * @param {Array|String|RegExp} filter 过滤条件
   * @param {String} str 查询字符串
   * @return {Boolean} 是否存在于过滤器中
   */
  inFilter(filter, str) {
    if (!filter) return false;

    if (Array.isArray(filter)) {
      let result = false;
      for (let i = 0; i < filter.length; i++) {
        if (this.inFilter(filter[i], str)) {
          result = true;
          break;
        }
      }
      return result;
    }

    if (typeof filter === 'string') {
      return str.indexOf(filter) > -1;
    } else if (Object.prototype.toString.call(filter) === '[object RegExp]') {
      return str.match(filter);
    }

    throw new Error('str must be a string or RegExp');
  },
  random(base = 1000, seed = 9999) {
    return Math.random() * seed + base;
  },
};
