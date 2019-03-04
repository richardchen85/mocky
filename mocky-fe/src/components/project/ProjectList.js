import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spin, Button, Modal } from 'antd';
import './ProjectList.css';
import ProjectItem from './ProjectItem';
import ProjectEdit from './ProjectEdit';

class ProjectList extends PureComponent {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    getById: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onItemSave: PropTypes.func.isRequired,
    onItemDelete: PropTypes.func.isRequired,
  }

  state = {
    edit: false,
    saving: false,
    project: {}
  }

  render() {
    const { edit, saving, project } = this.state;
    const { projects, user, fetching, onItemClick } = this.props;

    if (fetching) {
      return (
        <div className="project-list">
          <Spin style={{marginLeft:15}} />
        </div>
      )
    }

    return (
      <>
        <Button type="primary" icon="plus" onClick={this.handleCreate}>添加项目</Button>
        <div className="project-list">
          { projects.map(project => (
            <ProjectItem
              key={project.id}
              project={project}
              user={user}
              onClick={onItemClick}
              onEdit={this.handleEdit}
              onSave={this.handleOk}
              onDelete={this.handleDelete} />
          ))}
        </div>
        { edit && <ProjectEdit
          fetching={saving}
          project={project}
          auth={user}
          onCancel={this.handleCancel}
          onOk={this.handleOk} /> }
      </>
    )
  }

  handleCreate = () => {
    this.setState({ edit: true, project: {} });
  }

  handleEdit = (project) => {
    if (this.gettingProject) return;

    const { getById } = this.props;
    this.gettingProject = true;
    getById(project.id).then(json => {
      this.gettingProject = false;
      this.setState({ edit: true, project: json.data });
    }).catch(error => {
      console.log(error);
    });
  }

  handleDelete = (project) => {
    const { onItemDelete } = this.props;

    Modal.confirm({
      title: '删除项目',
      content: '您确认要删除该项目吗？',
      onOk: () => {
        onItemDelete(project.id);
      }
    });
  }

  handleOk = (project) => {
    if (this.state.saving) return;

    this.setState({ saving: true });

    const { onItemSave } = this.props;
    onItemSave(project, errorMsg => {
      if (!errorMsg) {
        this.setState({ edit: false, saving: false });
      } else {
        this.setState({ saving: false });
      }
    });
  }

  handleCancel = () => {
    this.setState({ edit: false, saving: false, project: {} });
  }
}

export default ProjectList;