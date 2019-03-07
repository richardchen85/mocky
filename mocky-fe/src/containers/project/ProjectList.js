import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLayout from '../../components/PageLayout';
import ProjectList from '../../components/project/ProjectList';
import { operations } from '../../redux/project';
import { actions } from '../../redux/project';

class ProjectListContainer extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, data, auth, logout, getById } = this.props;

    return (
      <>
        <PageLayout auth={auth} logout={logout}>
          <ProjectList
            projects={data}
            user={auth}
            fetching={fetching}
            getById={getById}
            onItemClick={this.onItemClick}
            onItemSave={this.saveProject}
            onItemDelete={this.onItemDelete} />
        </PageLayout>
      </>
    )
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    this.props.getList();
  }

  onItemClick = (projectId) => {
    this.props.history.push({
      pathname: '/project/' + projectId,
    });
  }

  onItemDelete = (projectId) => {
    this.props.deleteProject(projectId).then(() => {
      this.fetchList();
    });
  }

  saveProject = (project, callback) => {
    this.props.saveProject(project).then(() => {
      callback && callback();
      this.fetchList();
    }).catch(error => {
      callback && callback(error.message);
    });
  }
}

export default connect(
  state => ({
    ...state.project.list,
  }),
  {
    getList: actions.getList,
    deleteProject: operations.deleteProject,
    saveProject: operations.saveProject,
    getById: operations.getProjectById,
  }
)(ProjectListContainer);
