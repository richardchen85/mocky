import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './ProjectItem.css';

class ProjectItem extends PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  render() {
    const { project, user, onClick, onEdit, onDelete } = this.props

    return (
      <div className="project-item">
        <div className="project-name" onClick={() => onClick(project.id)}>
          <Icon type="wallet"/>
          <span className="fake-link">{project.name}</span>
        </div>
        <div className="project-desc">{project.desc}</div>
        <div className="project-create">
          <Icon type="user" title={project.owner.nickname}/> {project.owner.nickname} <br/>
          创建于：{project.create_time}
        </div>
        {project.user_id === user.id &&
        <div className="project-ctrl">
          <Icon type="edit" title="修改" onClick={() => onEdit(project)}/>
          <Icon type="delete" title="删除" onClick={() => onDelete(project)}/>
        </div>
        }
      </div>
    )
  }
}

export default ProjectItem;
