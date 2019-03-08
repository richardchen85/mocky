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
    interfaces: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
  }

  state = {
    activeId: 0,
    edit: false,
    saving: false,
    itf: {}
  }

  render() {
    const { activeId, edit, saving, itf } = this.state;
    const { interfaces, projectId } = this.props;
    const activeInterface = interfaces.find(itf => itf.id === activeId);

    return (
      <div className="project-interfaces">
        <div className="interface-sidebar">
          <SortableHOC onSortChange={this.handleSort}>
            <div className="interface-tabs">
              { interfaces.map(itf => (
                <InterfaceTabItem
                  key={itf.id}
                  data={itf}
                  active={itf === activeInterface}
                  onClick={this.changeActiveId}
                  onDelete={this.handleDelete}
                  onSave={this.handleSave}
                  onEdit={this.handleEdit} />
              )) }
            </div>
          </SortableHOC>
          <div className="new-interface">
            <span className="fake-link" onClick={this.handleCreate}>
              <Icon type="plus" /> 新建接口
            </span>
          </div>
          { edit && <InterfaceForm data={itf} saving={saving} onCancel={this.handleCancel}
              onSave={this.handleSave} /> }
        </div>
        <div className="interface-detail">
          { activeInterface && <InterfaceDetail projectId={projectId} data={activeInterface} /> }
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.changeActiveId(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
      this.changeActiveId(null);
    }
  }

  changeActiveId = (id) => {
    const { interfaces } = this.props;
    if (id) {
      this.setState({ activeId: id });
    } else if (interfaces.length > 0) {
      this.setState({ activeId: interfaces[0].id });
    }
  }

  handleEdit = (itf) => {
    this.setState({ edit: true, itf });
  }

  handleCreate = () => {
    const { projectId, groupId } = this.props;
    this.setState({
      edit: true,
      itf: { project_id: projectId, group_id: groupId },
    });
  }

  handleSave = (itf) => {
    if (this.state.saving) return;

    this.setState({ saving: true });
    const { onSave } = this.props;
    onSave(itf, errorMsg => {
      if (!errorMsg) {
        this.setState({ edit: false, saving: false });
      } else {
        this.setState({ saving: false });
      }
    });
  }

  handleCancel = () => {
    this.setState({ edit: false, saving: false, itf: {} });
  }

  handleDelete = (itf) => {
    const { onDelete } = this.props;
    Modal.confirm({
      title: '删除接口',
      content: '您确认要删除该接口吗？',
      onOk: () => {
        onDelete(itf.id);
      }
    });
  }

  handleSort = (e, sortable) => {
    const { onSort } = this.props;
    onSort && onSort(sortable.toArray());
  }
}

export default Interfaces;
