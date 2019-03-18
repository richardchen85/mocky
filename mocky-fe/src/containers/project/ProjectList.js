import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLayout from '../../components/PageLayout';
import ProjectList from '../../components/project/ProjectList';
import { types } from '../../redux/model/projectList';

class ProjectListContainer extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, data, edit, auth, logout } = this.props;

    return (
      <>
        <PageLayout auth={auth} logout={logout}>
          <ProjectList
            projects={data}
            edit={edit}
            user={auth}
            fetching={fetching}
            getProject={this.getProject}
            setEdit={this.setEdit}
            onItemClick={this.onItemClick}
            onItemSave={this.saveProject}
            onItemDelete={this.onItemDelete}
          />
        </PageLayout>
      </>
    );
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    this.props.dispatch({ type: types.getList });
  };

  onItemClick = projectId => {
    this.props.history.push({
      pathname: '/project/' + projectId,
    });
  };

  onItemDelete = projectId => {
    this.props.dispatch({ type: types.delete, payload: projectId });
  };

  getProject = (projectId) => {
    this.props.dispatch({ type: types.getProject, payload: projectId });
  };

  setEdit = (edit) => {
    this.props.dispatch({ type: types.edit, payload: edit });
  };

  saveProject = project => {
    this.props.dispatch({ type: types.save, payload: project });
  };
}

export default connect(
  state => ({
    ...state.projectList,
  })
)(ProjectListContainer);
