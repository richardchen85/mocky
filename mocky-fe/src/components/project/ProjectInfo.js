import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import './ProjectInfo.css';

class ProjectInfo extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <div className="project-info">
        <div className="breadcrumb">
          <Icon type="home" style={{ marginRight: 5 }}/>
          <Link to={{ pathname: '/' }}>首页</Link> / {data.name}
        </div>
        <div className="project-desc">{data.desc}</div>
      </div>
    )
  }
}

export default ProjectInfo;
