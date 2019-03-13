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
    group: PropTypes.object.isRequired,
    itface: PropTypes.object.isRequired,
    setGroup: PropTypes.func.isRequired,
    setInterface: PropTypes.func.isRequired,
    onGroupSave: PropTypes.func.isRequired,
    onGroupDelete: PropTypes.func.isRequired,
    onGroupSort: PropTypes.func.isRequired,
    onInterfaceSave: PropTypes.func.isRequired,
    onInterfaceDelete: PropTypes.func.isRequired,
    onInterfaceSort: PropTypes.func.isRequired,
  };

  state = {
    activeId: 0,
  };

  render() {
    const { activeId } = this.state;
    const {
      projectId,
      groups,
      group,
      itface,
      setInterface,
      onGroupSave,
      onInterfaceDelete,
      onInterfaceSave,
      onInterfaceSort,
    } = this.props;
    const activeGroup = groups.find(group => group.id === activeId);

    return (
      <div className="groups">
        <div className="group-tabs">
          <SortableHOC onSortChange={this.handleSort}>
            <ul className="tabs-list">
              {groups.map(group => (
                <GroupTabTitle
                  key={group.id}
                  projectId={projectId}
                  group={group}
                  active={activeGroup === group}
                  onClick={this.changeActiveId}
                  onGroupSave={onGroupSave}
                  onDelete={this.handleDelete}
                  onEdit={this.handleEdit}
                />
              ))}
            </ul>
          </SortableHOC>
          <div className="new-tab">
            <span className="fake-link" onClick={this.handleCreate}>
              <Icon type="plus-square" /> 添加分组
            </span>
            {group.editing && (
              <GroupForm
                group={group.data}
                saving={group.saving}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
              />
            )}
          </div>
        </div>
        {activeGroup && (
          <Interfaces
            projectId={projectId}
            groupId={activeGroup.id}
            groups={groups}
            interfaces={activeGroup.interfaces}
            itface={itface}
            setInterface={setInterface}
            onDelete={onInterfaceDelete}
            onSave={onInterfaceSave}
            onSort={onInterfaceSort}
          />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.changeActiveId(null);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      this.changeActiveId(null);
    }
  }

  changeActiveId = id => {
    const { groups } = this.props;
    if (id) {
      this.setState({ activeId: id });
    } else if (groups.length > 0) {
      this.setState({ activeId: groups[0].id });
    }
  };

  handleCreate = () => {
    const { setGroup, projectId } = this.props;
    setGroup({
      data: { project_id: projectId },
      editing: true,
    });
  };

  handleEdit = group => {
    this.props.setGroup({ editing: true, data: group });
  };

  handleSave = group => {
    const {
      onGroupSave,
      group: { saving },
    } = this.props;
    !saving && onGroupSave(group);
  };

  handleCancel = () => {
    this.props.setGroup({ editing: false, saving: false, data: null });
  };

  handleDelete = group => {
    const { onGroupDelete } = this.props;

    Modal.confirm({
      title: '删除分组',
      content: '您确认要删除该分组吗？',
      onOk: () => {
        onGroupDelete(group.id);
      },
    });
  };

  handleSort = (e, sortable) => {
    const { onGroupSort } = this.props;
    onGroupSort && onGroupSort(sortable.toArray());
  };
}

export default GroupTabs;
