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
    edit: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    getMock: PropTypes.func.isRequired,
    setEdit: PropTypes.func.isRequired,
  };

  columns = [
    { title: 'id', key: ' id', dataIndex: 'id' },
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '状态码', key: 'status_code', dataIndex: 'status_code' },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Icon type="edit" title="修改" onClick={() => this.handleEdit(record.id)} style={{ cursor: 'pointer' }} />
          <Divider type="vertical" />
          <Icon type="delete" title="删除" onClick={() => this.handleDelete(record.id)} style={{ cursor: 'pointer' }} />
        </span>
      ),
    },
  ];

  render() {
    const { data, edit } = this.props;
    const codeMode = this.getCodeMode();

    return (
      <>
        <div style={{ marginBottom: 10 }}>
          <Button htmlType="button" type="primary" size="small" onClick={this.handleCreate}>
            添加模拟数据
          </Button>
        </div>
        <Table columns={this.columns} dataSource={data} rowKey="id" size="small" bordered={true} pagination={false} />
        {edit.editing && (
          <MockForm
            data={edit.data}
            mode={codeMode}
            saving={edit.saving}
            onCancel={this.handleCancel}
            onSave={this.handleSave}
          />
        )}
      </>
    );
  }

  handleCreate = () => {
    const { projectId, itf, setEdit } = this.props;
    setEdit({
      editing: true,
      data: {
        project_id: projectId,
        interface_id: itf.id,
      },
    });
  };

  handleEdit = id => {
    this.props.getMock(id);
  };

  handleDelete = id => {
    const { onDelete } = this.props;

    Modal.confirm({
      title: '删除映射',
      content: '您确认要删除该数据映射规则吗？',
      onOk: () => {
        onDelete(id);
      },
    });
  };

  handleSave = edit => {
    const {
      onSave,
      edit: { saving },
    } = this.props;
    !saving && onSave(edit);
  };

  handleCancel = () => {
    this.props.setEdit({ editing: false, saving: false });
  };

  getCodeMode() {
    const { itf } = this.props;
    return itf.content_type === contentTypes.types[0].key ? { name: 'javascript', json: true } : 'htmlmixed';
  }
}

export default MockList;
