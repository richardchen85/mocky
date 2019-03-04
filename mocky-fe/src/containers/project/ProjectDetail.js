import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PageLayout from '../../components/PageLayout';
import ProjectInfo from '../../components/project/ProjectInfo';
import GroupTabs from '../../components/project/GroupTabs';

import { operations } from '../../redux/project';

class ProjectDetail extends PureComponent {
  render() {
    const { auth, logout, data, fetching, match, sortGroup, sortInterface } = this.props;
    const groups = data.groups || [];
    const currentId = Number(match.params.id);

    if (fetching || !data.id || currentId !== data.id) {
      return <PageLayout auth={auth} logout={logout}><Spin /></PageLayout>
    }

    return (
      <PageLayout auth={auth} logout={logout}>
        <ProjectInfo data={data} />
        <GroupTabs
          projectId={data.id}
          groups={groups}
          onGroupSave={this.saveGroup}
          onGroupDelete={this.deleteGroup}
          onGroupSort={sortGroup}
          onInterfaceSave={this.saveInterface}
          onInterfaceDelete={this.deleteInterface}
          onInterfaceSort={sortInterface} />
      </PageLayout>
    )
  }

  componentDidMount() {
    this.getDetail();
  }

  /**
   * 拉取当前项目的详细数据
   */
  getDetail() {
    const { match, getDetail } = this.props;
    getDetail(match.params.id);
  }

  /**
   * 保存分组
   * @param {*} group
   * @param {function} callback
   */
  saveGroup = (group, callback) => {
    const { createGroup, updateGroup } = this.props;
    const action = group.id ? updateGroup : createGroup;
    action(group).then(json => {
      callback && callback();
      this.getDetail();
    }).catch(error => {
      callback && callback(error.message);
    });
  };

  /**
   * 删除分组
   */
  deleteGroup = (id) => {
    this.props.deleteGroup(id).then(() => {
      this.getDetail();
    }).catch(error => {
      console.error(error);
    });
  };

  /**
   * 保存接口
   * @param {*} itf
   * @param {function} callback
   */
  saveInterface = (itf, callback) => {
    const { createInterface, updateInterface } = this.props;
    const action = itf.id ? updateInterface : createInterface;
    action(itf).then(json => {
      callback && callback();
      this.getDetail();
    }).catch(error => {
      callback && callback(error.message);
    });
  };

  /**
   * 删除接口
   */
  deleteInterface = (id) => {
    this.props.deleteInterface(id).then(() => {
      this.getDetail();
    }).catch(error => {
      console.error(error);
    });
  }
}

export default connect(
  state => ({
    ...state.project.detail
  }),
  {
    getDetail: operations.getDetail,
    deleteGroup: operations.deleteGroup,
    createGroup: operations.createGroup,
    updateGroup: operations.updateGroup,
    sortGroup: operations.sortGroup,
    deleteInterface: operations.deleteInterface,
    createInterface: operations.createInterface,
    updateInterface: operations.updateInterface,
    sortInterface: operations.sortInterface,
  }
)(ProjectDetail);
