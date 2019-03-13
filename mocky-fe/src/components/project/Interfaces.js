import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import './interfaces.css';
import InterfaceDetail from './InterfaceDetail';
import InterfaceTabItem from './InterfaceTabItem';
import InterfaceForm from './InterfaceForm';
import SortableHOC from '../SortableHOC';

class Interfaces extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    groupId: PropTypes.number.isRequired,
    groups: PropTypes.array.isRequired,
    interfaces: PropTypes.array.isRequired,
    itface: PropTypes.object.isRequired,
    setInterface: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
  };

  state = {
    activeId: 0,
  };

  render() {
    const { activeId } = this.state;
    const { interfaces, projectId, itface, groups } = this.props;
    const activeInterface = interfaces.find(itf => itf.id === activeId);

    return (
      <div className="project-interfaces">
        <div className="interface-sidebar">
          <SortableHOC onSortChange={this.handleSort}>
            <div className="interface-tabs">
              {interfaces.map(itf => (
                <InterfaceTabItem
                  key={itf.id}
                  data={itf}
                  active={itf === activeInterface}
                  onClick={this.changeActiveId}
                  onDelete={this.handleDelete}
                  onSave={this.handleSave}
                  onEdit={this.handleEdit}
                />
              ))}
            </div>
          </SortableHOC>
          <div className="new-interface">
            <span className="fake-link" onClick={this.handleCreate}>
              <Icon type="plus" /> 新建接口
            </span>
          </div>
          {itface.editing && (
            <InterfaceForm
              data={itface.data}
              groups={groups}
              saving={itface.saving}
              onCancel={this.handleCancel}
              onSave={this.handleSave}
            />
          )}
        </div>
        <div className="interface-detail">
          {activeInterface && <InterfaceDetail projectId={projectId} data={activeInterface} />}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.changeActiveId(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
      this.changeActiveId(null);
    }
  }

  changeActiveId = id => {
    const { interfaces } = this.props;
    if (id) {
      this.setState({ activeId: id });
    } else if (interfaces.length > 0) {
      this.setState({ activeId: interfaces[0].id });
    }
  };

  handleEdit = itf => {
    this.props.setInterface({ editing: true, data: itf });
  };

  handleCreate = () => {
    const { projectId, groupId, setInterface } = this.props;
    setInterface({
      editing: true,
      data: { project_id: projectId, group_id: groupId },
    });
  };

  handleSave = itf => {
    const {
      onSave,
      itface: { saving },
    } = this.props;
    !saving && onSave(itf);
  };

  handleCancel = () => {
    this.props.setInterface({ editing: false, data: null, saving: false });
  };

  handleDelete = itf => {
    const { onDelete } = this.props;
    Modal.confirm({
      title: '删除接口',
      content: '您确认要删除该接口吗？',
      onOk: () => {
        onDelete(itf.id);
      },
    });
  };

  handleSort = (e, sortable) => {
    const { onSort } = this.props;
    onSort && onSort(sortable.toArray());
  };
}

export default Interfaces;
