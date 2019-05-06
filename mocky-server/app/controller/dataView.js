'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/dataView');
const messages = require('../common/messages');
const contentTypes = require('../common/contentTypes');
const dataMapFroms = require('../common/dataMapFroms');
const Mock = require('mockjs');

class DataViewController extends Controller {
  /**
   * ALL /dataView/[project_id]/[mock.url]
   */
  async view() {
    const {
      ctx,
      ctx: { request, service, logger, params },
    } = this;
    const param = {
      project_id: parseInt(params[0]),
      url: params[1],
    };

    if (!this.isValid(validateRule, param)) return;

    if (!param.url.startsWith('/')) {
      param.url = '/' + param.url;
    }

    try {
      let itface = await service.interface.getByProject(param.project_id);
      itface = itface.filter(itf => itf.url === param.url)[0];
      if (!itface) {
        this.fail(messages.common.notFound);
        return;
      }

      // 获取映射规则
      const maps = await service.dataMap.getByInterface(itface.id);
      // 获取匹配的 mock_id
      let mockId = this.matchMockId(maps, param.url);
      // 没有匹配的规则，获取第一条
      if (!mockId) {
        let mocks = await service.mock.getByInterface(itface.id);
        if (mocks && mocks.length > 0) {
          mockId = mocks[0].id;
        }
      }

      // 要返回的 mock 数据
      let mock;
      if (mockId) {
        mock = await service.mock.getById(mockId);
        if (mock.interface_id !== itface.id) {
          mock = null;
        }
      }

      if (!mock) {
        this.fail(messages.common.notFound);
        return;
      }

      if (mock.mock_js) {
        mock.body = Mock.mock(JSON.parse(mock.body));
      }

      let callback;
      if (itface.jsonp_callback) {
        callback = request.query[itface.jsonp_callback];
      }
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Content-Type', contentTypes.getByKey(itface.content_type).content);
      ctx.status = mock.status_code;
      ctx.body = callback ? `${callback}(${mock.body})` : mock.body;
    } catch (e) {
      logger.error(e);
      this.fail(messages.common.sysError);
    }
  }

  /**
   * 查找匹配的 mock 数据
   * @param {Array} maps maps array
   * @param {String} path interface path
   * @return {Object} mock
   */
  matchMockId(maps, path) {
    const { request } = this.ctx;

    let mockId;

    for (let i = 0; i < maps.length; i++) {
      const map = maps[i];
      // 参数来源，url or body
      let source;

      // 不需要匹配，直接指定 mock_id
      if (map.from === dataMapFroms.none) {
        mockId = map.mock_id;
        break;
      }

      if (map.from === dataMapFroms.path) {
        source = path;
      } else if (map.from === dataMapFroms.query) {
        source = request.querystring;
      } else if (map.from === dataMapFroms.body) {
        source = request.rawBody || '';
      }

      if (!map.regex) {
        // 普通字符串匹配
        if (source.indexOf(map.match) > -1) {
          mockId = map.mock_id;
        }
      } else {
        // 正则匹配
        const matchResult = new RegExp(map.match, 'ig').exec(source);
        if (matchResult) {
          if (map.mock_id.indexOf('$') > -1) {
            mockId = map.mock_id.replace(/\$(\d)/gi, function(match, g1) {
              return matchResult[g1];
            });
          } else {
            mockId = map.mock_id;
          }
        }
      }

      if (mockId) break;
    }

    return mockId;
  }
}

module.exports = DataViewController;
