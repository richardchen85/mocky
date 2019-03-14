import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PageLayout from '../../components/PageLayout';
import ProjectInfo from '../../components/project/ProjectInfo';
import GroupTabs from '../../components/project/GroupTabs';
import TransferFrom from './TransferForm';

import { actions } from '../../redux/project';

class ProjectDetail extends PureComponent {
  render() {
    const {
      auth,
      logout,
      data,
      fetching,
      match,
      group,
      itface,
      setGroup,
      setInterface,
      sortGroup,
      sortInterface,
    } = this.props;
    const groups = data.groups || [];
    const currentId = Number(match.params.id);

    if (fetching || !data.id || currentId !== data.id) {
      return (
        <PageLayout auth={auth} logout={logout}>
          <Spin />
        </PageLayout>
      );
    }

    return (
      <PageLayout auth={auth} logout={logout}>
        <ProjectInfo data={data} auth={auth} openTransfer={this.openTransfer} />
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
          onInterfaceSort={sortInterface}
        />
        <TransferFrom />
      </PageLayout>
    );
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
  saveGroup = group => {
    this.props.saveGroup(group);
  };

  /**
   * 删除分组
   */
  deleteGroup = id => {
    this.props.deleteGroup(id);
  };

  /**
   * 保存接口
   * @param {*} itf
   */
  saveInterface = itf => {
    this.props.saveInterface(itf);
  };

  /**
   * 删除接口
   */
  deleteInterface = id => {
    this.props.deleteInterface(id);
  };

  /**
   * 打开转移对话框
   */
  openTransfer = () => {
    const { data, setTransfer } = this.props;
    setTransfer({ show: true, project_id: data.id });
  };
}

export default connect(
  state => ({
    ...state.project.detail,
  }),
  {
    getDetail: actions.getDetail,
    setGroup: actions.setGroup,
    deleteGroup: actions.deleteGroup,
    saveGroup: actions.saveGroup,
    sortGroup: actions.sortGroup,
    setInterface: actions.setInterface,
    deleteInterface: actions.deleteInterface,
    saveInterface: actions.saveInterface,
    sortInterface: actions.sortInterface,
    setTransfer: actions.setTransfer,
  }
)(ProjectDetail);
