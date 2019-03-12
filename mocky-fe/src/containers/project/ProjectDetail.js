import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PageLayout from '../../components/PageLayout';
import ProjectInfo from '../../components/project/ProjectInfo';
import GroupTabs from '../../components/project/GroupTabs';

import { actions } from '../../redux/project';

class ProjectDetail extends PureComponent {
  render() {
    const { auth, logout, data, fetching, match, group, itface, setGroup, setInterface, sortGroup, sortInterface } = this.props;
    const groups = data.groups || [];
    const currentId = Number(match.params.id);

    if (fetching || !data.id || currentId !== data.id) {
      return <PageLayout auth={auth} logout={logout}><Spin/></PageLayout>
    }

    return (
      <PageLayout auth={auth} logout={logout}>
        <ProjectInfo data={data}/>
        <GroupTabs
          projectId={data.id}
          groups={groups}
          group={group}
          itface={itface}
          setGroup={setGroup}
          setInterface={setInterface}
          onGroupSave={this.saveGroup}
          onGroupDelete={this.deleteGroup}
          onGroupSort={sortGroup}
          onInterfaceSave={this.saveInterface}
          onInterfaceDelete={this.deleteInterface}
          onInterfaceSort={sortInterface}/>
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
   */
  saveGroup = (group) => {
    const { createGroup, updateGroup } = this.props;
    group.id ? updateGroup(group) : createGroup(group);
  };

  /**
   * 删除分组
   */
  deleteGroup = (id) => {
    this.props.deleteGroup(id);
  };

  /**
   * 保存接口
   * @param {*} itf
   */
  saveInterface = (itf) => {
    const { createInterface, updateInterface } = this.props;
    itf.id ? updateInterface(itf) : createInterface(itf);
  };

  /**
   * 删除接口
   */
  deleteInterface = (id) => {
    this.props.deleteInterface(id);
  }
}

export default connect(
  state => ({
    ...state.project.detail
  }),
  {
    getDetail: actions.getDetail,
    setGroup: actions.setGroup,
    deleteGroup: actions.deleteGroup,
    createGroup: actions.createGroup,
    updateGroup: actions.updateGroup,
    sortGroup: actions.sortGroup,
    setInterface: actions.setInterface,
    deleteInterface: actions.deleteInterface,
    createInterface: actions.createInterface,
    updateInterface: actions.updateInterface,
    sortInterface: actions.sortInterface,
  }
)(ProjectDetail);
