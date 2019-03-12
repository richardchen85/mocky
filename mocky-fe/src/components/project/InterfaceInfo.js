import React, { PureComponent } from 'react';
import contentTypes from '../../constants/contentTypes';

class InterfaceInfo extends PureComponent {
  render() {
    const { data, projectId } = this.props;
    const contentType = contentTypes.getByKey(data.content_type);

    let url = `//mocky.chenliqiang.cn/dataView/${projectId}${data.url}`;
    if (window.__DEV__) {
      url = `//dev.mocky.chenliqiang.cn/dataView/${projectId}${data.url}`;
    }

    return (
      <dl className="interface-info">
        <dt>{data.desc}</dt>
        <dd>
          地址：
          <a href={url} target="_blank" rel="noopener noreferrer">
            {data.url}
          </a>
        </dd>
        <dd>请求类型：{data.method.toUpperCase()}</dd>
        <dd>响应格式：{contentType.name}</dd>
        <dd>jsonp回调key：{data.jsonp_callback || '-'}</dd>
      </dl>
    );
  }
}

export default InterfaceInfo;
