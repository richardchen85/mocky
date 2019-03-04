import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Divider, Icon, Modal, Button } from 'antd';
import MockForm from './MockForm';
import contentTypes from '../../constants/contentTypes';

class MockList extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    itf: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    getById: PropTypes.func.isRequired,
  }

  columns = [
    { title: 'id', key:' id', dataIndex: 'id' },
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '状态码', key: 'status_code', dataIndex: 'status_code' },
    { title: '操作', key: 'action', render: (text, record) => (
      <span>
        <Icon type="edit" title="修改" onClick={ () => this.handleEdit(record.id) } style={{cursor:'pointer'}} />
        <Divider type="vertical" />
        <Icon type="delete" title="删除" onClick={ () => this.handleDelete(record.id) } style={{cursor:'pointer'}} />
      </span>
    )},
  ];

  state = {
    edit: false,
    saving: false,
    mock: {}
  }

  render() {
    const { edit, saving, mock } = this.state;
    const { data } = this.props;
    const codeMode = this.getCodeMode();

    return (
      <>
        <div style={{marginBottom:10}}> 
          <Button type="primary" size="small" onClick={this.handleCreate}>添加模拟数据</Button>
        </div>
        <Table columns={this.columns} dataSource={data} rowKey="id" size="small" bordered={true} pagination={false} />
        { edit && <MockForm data={mock} mode={codeMode} saving={saving} onCancel={this.handleCancel} onSave={this.handleSave} /> }
      </>
    )
  }

  handleCreate = () => {
    const { projectId, itf } = this.props;
    this.setState({
      edit: true,
      mock: {
        project_id: projectId,
        interface_id: itf.id,
      }
    });
  }

  handleEdit = (id) => {
    if (this.gettingDetail) return;
    this.gettingDetail = true;
    this.props.getById(id).then(json => {
      this.gettingDetail = false;
      this.setState({ edit: true, mock: json.data });
    }).catch(error => {
      this.gettingDetail = false;
      console.error(error);
    });
  }

  handleDelete = (id) => {
    const { onDelete } = this.props;

    Modal.confirm({
      title: '删除映射',
      content: '您确认要删除该数据映射规则吗？',
      onOk: () => {
        onDelete(id);
      }
    })
  }

  handleSave = (mock) => {
    if (this.state.saving) return;

    this.setState({ saving: true });
    const { onSave } = this.props;
    onSave(mock, errorMsg => {
      if (!errorMsg) {
        this.setState({ edit: false, saving: false });
      } else {
        this.setState({ saving: false });
      }
    });
  }

  handleCancel = () => {
    this.setState({ edit: false, saving: false, mock: {} });
  }

  getCodeMode() {
    const { itf } = this.props;
    return itf.content_type === contentTypes.types[0].key ? { name: 'javascript', json: true } : 'htmlmixed';
  }
}

export default MockList;