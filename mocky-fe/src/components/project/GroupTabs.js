import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import './GroupTabs.css';
import GroupTabTitle from './GroupTabTitle';
import Interfaces from './Interfaces';
import GroupForm from './GroupForm';
import SortableHOC from '../SortableHOC';

class GroupTabs extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    onGroupSave: PropTypes.func.isRequired,
    onGroupDelete: PropTypes.func.isRequired,
    onGroupSort: PropTypes.func.isRequired,
    onInterfaceSave: PropTypes.func.isRequired,
    onInterfaceDelete: PropTypes.func.isRequired,
    onInterfaceSort: PropTypes.func.isRequired,
  }

  state = {
    activeId: 0,
    edit: false,
    saving: false,
    group: {}
  }

  render() {
    const { activeId, edit, saving, group } = this.state;
    const { projectId, groups, onGroupSave, onInterfaceDelete, onInterfaceSave, onInterfaceSort } = this.props;
    const activeGroup = groups.find(group => group.id === activeId);

    return (
      <div className="groups">
        <div className="group-tabs">
          <SortableHOC onSortChange={this.handleSort}>
            <ul className="tabs-list">
              { groups.map(group => (
                <GroupTabTitle
                  key={group.id}
                  projectId={projectId}
                  group={group}
                  active={activeGroup === group}
                  onClick={this.changeActiveId}
                  onGroupSave={onGroupSave}
                  onDelete={this.handleDelete}
                  onEdit={this.handleEdit} />
              ))}
            </ul>
            </SortableHOC>
          <div className="new-tab">
            <span className="fake-link" onClick={this.handleCreate}><Icon type="plus-square" /> 添加分组</span>
            { edit && <GroupForm
              group={group}
              saving={saving}
              onCancel={this.handleCancel}
              onSave={this.handleSave} /> }
          </div>
        </div>
        { activeGroup && <Interfaces projectId={projectId} groupId={activeGroup.id} interfaces={activeGroup.interfaces} onDelete={onInterfaceDelete} onSave={onInterfaceSave} onSort={onInterfaceSort} /> }
      </div>
    )
  }

  componentDidMount() {
    this.changeActiveId(null);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      this.changeActiveId(null);
    }
  }

  changeActiveId = (id) => {
    const { groups } = this.props;
    if (id) {
      this.setState({ activeId: id });
    } else if (groups.length > 0) {
      this.setState({ activeId: groups[0].id });
    }
  }

  handleCreate = () => {
    this.setState({
      edit: true,
      group: { project_id: this.props.projectId }
    });
  }

  handleEdit = (group) => {
    this.setState({ edit: true, group });
  }

  handleSave = (group) => {
    if (this.state.saving) return;

    this.setState({ saving: true });
    const { onGroupSave } = this.props;
    onGroupSave(group, errorMsg => {
      if (!errorMsg) {
        this.setState({ edit: false, saving: false });
      } else {
        this.setState({ saving: false });
      }
    });
  }

  handleCancel = () => {
    this.setState({ edit: false, saving: false, group: {} })
  }

  handleDelete = (group) => {
    const { onGroupDelete } = this.props;

    Modal.confirm({
      title: '删除分组',
      content: '您确认要删除该分组吗？',
      onOk: () => {
        onGroupDelete(group.id);
      }
    });
  }

  handleSort = (e, sortable) => {
    const { onGroupSort } = this.props;
    onGroupSort && onGroupSort(sortable.toArray());
  }
}

export default GroupTabs;