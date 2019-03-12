import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLayout from '../../components/PageLayout';
import ProjectList from '../../components/project/ProjectList';
import { actions } from '../../redux/project';

class ProjectListContainer extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, data, project, auth, logout, getProject, setProject } = this.props;

    return (
      <>
        <PageLayout auth={auth} logout={logout}>
          <ProjectList
            projects={data}
            project={project}
            user={auth}
            fetching={fetching}
            getProject={getProject}
            setProject={setProject}
            onItemClick={this.onItemClick}
            onItemSave={this.saveProject}
            onItemDelete={this.onItemDelete}
          />
        </PageLayout>
      </>
    );
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    this.props.getList();
  };

  onItemClick = projectId => {
    this.props.history.push({
      pathname: '/project/' + projectId,
    });
  };

  onItemDelete = projectId => {
    this.props.deleteProject(projectId);
  };

  saveProject = project => {
    this.props.saveProject(project);
  };
}

export default connect(
  state => ({
    ...state.project.list,
  }),
  {
    getList: actions.getList,
    getProject: actions.getProject,
    setProject: actions.setProject,
    saveProject: actions.saveProject,
    deleteProject: actions.deleteProject,
  }
)(ProjectListContainer);
