import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Spin, Button, Modal} from 'antd';
import './ProjectList.css';
import ProjectItem from './ProjectItem';
import ProjectEdit from './ProjectEdit';

class ProjectList extends PureComponent {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    getProject: PropTypes.func.isRequired,
    setProject: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onItemSave: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
  };

  render() {
    const {projects, project, user, fetching, onItemClick} = this.props;

    if (fetching) {
      return (
        <div className="project-list">
          <Spin style={{marginLeft: 15}}/>
        </div>
      )
    }

    return (
      <>
        <Button type="primary" icon="plus" onClick={this.handleCreate}>添加项目</Button>
        <div className="project-list">
          {projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
              user={user}
              onClick={onItemClick}
              onEdit={this.handleEdit}
              onSave={this.handleOk}
              onDelete={this.handleDelete}/>
          ))}
        </div>
        {project.editing && <ProjectEdit
          fetching={project.saving}
          project={project.data}
          auth={user}
          onCancel={this.handleCancel}
          onOk={this.handleOk}/>}
      </>
    )
  }

  handleCreate = () => {
    this.props.setProject({editing: true, data: {}});
  };

  handleEdit = (project) => {
    this.props.getProject(project.id);
  };

  handleDelete = (project) => {
    const {onItemDelete} = this.props;

    Modal.confirm({
      title: '删除项目',
      content: '您确认要删除该项目吗？',
      onOk: () => {
        onItemDelete(project.id);
      }
    });
  };

  handleOk = (project) => {
    const {onItemSave, project: {saving}} = this.props;
    !saving && onItemSave(project);
  };

  handleCancel = () => {
    this.props.setProject({data: null, editing: false, saving: false});
  };
}

export default ProjectList;
