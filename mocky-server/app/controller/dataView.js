'use strict';

const Controller = require('../core/baseController');
const validateRule = require('../validateRules/dataView');
const messages = require('../common/messages');
const contentTypes = require('../common/contentTypes');
const dataMapFroms = require('../common/dataMapFroms');

class DataViewController extends Controller {
  /**
   * ALL /dataView/[project_id]/[mock.url]
   */
  async view() {
    const { ctx, ctx: { request, service, logger, params } } = this;
    const param = {
      project_id: parseInt(params[0]),
      url: params[1],
    };

    if (!this.isValid(validateRule, param)) return;

    if (!param.url.startsWith('/')) {
      param.url = '/' + param.url;
    }

    try {
      const itface = await service.interface.get({
        project_id: param.project_id,
        url: param.url,
      });

      if (!itface) {
        this.fail(messages.common.notFound);
        return;
      }

      // 获取映射规则
      const maps = await service.dataMap.getByInterface(itface.id);
      // 获取匹配的 mock_id
      const mockId = this.matchMockId(maps, param.url);
      // 要返回的 mock 数据
      let mock;

      if (mockId) {
        // 从匹配规则中取 mock_id
        mock = await service.mock.get({
          interface_id: itface.id,
          id: mockId,
        });
      } else {
        // 匹配规则没有匹配到，则默认取第一条
        mock = await service.mock.get({ interface_id: itface.id });
      }

      if (!mock) {
        this.fail(messages.common.notFound);
        return;
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
        source = request.body;
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
