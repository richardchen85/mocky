import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PageLayout from '../../components/PageLayout';
import ProjectInfo from '../../components/project/ProjectInfo';
import GroupTabs from '../../components/project/GroupTabs';
import TransferFrom from './TransferForm';
import { types } from '../../redux/model/projectDetail';

class ProjectDetail extends PureComponent {
  render() {
    const { auth, logout, data, fetching, match, groupEdit, interfaceEdit } = this.props;
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
          groupEdit={groupEdit}
          interfaceEdit={interfaceEdit}
          setGroupEdit={this.setGroupEdit}
          setInterface={this.setInterfaceEdit}
          onGroupSave={this.saveGroup}
          onGroupDelete={this.deleteGroup}
          onGroupSort={this.sortGroup}
          onInterfaceSave={this.saveInterface}
          onInterfaceDelete={this.deleteInterface}
          onInterfaceSort={this.sortInterface}
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
    const { match, dispatch } = this.props;
    dispatch({ type: types.getDetail, payload: match.params.id });
  }

  setGroupEdit = edit => {
    this.props.dispatch({ type: types.setGroupEdit, payload: edit });
  };

  /**
   * 保存分组
   * @param {*} group
   */
  saveGroup = group => {
    this.props.dispatch({ type: types.saveGroup, payload: group });
  };

  /**
   * 删除分组
   */
  deleteGroup = id => {
    this.props.dispatch({ type: types.deleteGroup, payload: id });
  };

  sortGroup = ids => {
    const { data, dispatch } = this.props;
    dispatch({ type: types.sortGroup, payload: { ids, project_id: data.id } });
  };

  setInterfaceEdit = edit => {
    this.props.dispatch({ type: types.setInterfaceEdit, payload: edit });
  };

  /**
   * 保存接口
   * @param {*} itf
   */
  saveInterface = itf => {
    this.props.dispatch({ type: types.saveInterface, payload: itf });
  };

  /**
   * 删除接口
   */
  deleteInterface = id => {
    this.props.dispatch({ type: types.deleteInterface, payload: id });
  };

  sortInterface = ids => {
    const { data, dispatch } = this.props;
    dispatch({ type: types.sortInterface, payload: { ids, project_id: data.id } });
  };

  /**
   * 打开转移对话框
   */
  openTransfer = () => {
    const { data, dispatch } = this.props;
    dispatch({ type: types.setTransfer, payload: { show: true, project_id: data.id } });
  };
}

export default connect(state => ({ ...state.projectDetail }))(ProjectDetail);
