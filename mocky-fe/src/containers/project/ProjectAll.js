import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import PageLayout from '../../components/PageLayout';
import ProjectList from '../../components/project/ProjectList';
import { types } from '../../redux/model/projectAll';

class ProjectAllContainer extends PureComponent {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, data, page, auth, logout } = this.props;

    return (
      <PageLayout auth={auth} logout={logout}>
        <ProjectList
          projects={data}
          user={auth}
          edit={{}}
          fetching={fetching}
          getProject={this.getProject}
          setEdit={this.setEdit}
          onItemClick={this.onItemClick}
          onItemSave={this.saveProject}
          onItemDelete={this.onItemDelete}
        />
        <div style={{ textAlign: 'right' }}>
          <Pagination {...page} onChange={this.handlePageChange} />
        </div>
      </PageLayout>
    );
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    this.props.dispatch({ type: types.fetchList });
  };

  onItemClick = projectId => {
    this.props.history.push({
      pathname: '/project/' + projectId,
    });
  };

  onItemDelete = projectId => {
    //this.props.dispatch({ type: types.delete, payload: projectId });
  };

  getProject = projectId => {
    //this.props.dispatch({ type: types.getProject, payload: projectId });
  };

  setEdit = edit => {
    //this.props.dispatch({ type: types.edit, payload: edit });
  };

  saveProject = project => {
    //this.props.dispatch({ type: types.save, payload: project });
  };

  handlePageChange = current => {
    this.props.dispatch({ type: types.setPage, payload: { current } });
  };
}

export default connect(state => ({
  ...state.projectAll,
}))(ProjectAllContainer);
