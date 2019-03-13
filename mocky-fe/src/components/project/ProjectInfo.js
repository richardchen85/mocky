import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'antd';
import './ProjectInfo.css';

class ProjectInfo extends PureComponent {
  render() {
    const { data, auth } = this.props;

    return (
      <div className="project-info">
        <div className="breadcrumb">
          <Icon type="home" style={{ marginRight: 5 }} />
          <Link to={{ pathname: '/' }}>首页</Link> / {data.name}
        </div>
        <div className="project-desc">
          <span style={{ marginRight: 10 }}>{data.desc}</span>
          {auth.id === data.user_id && (
            <Button type="danger" size="small" icon="export">
              转移
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default ProjectInfo;
