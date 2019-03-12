import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Divider, Icon, Modal, Button } from 'antd';
import dataMapFroms from '../../constants/dataMapFroms';
import DataMapForm from './DataMapForm';

class DataMapList extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    interfaceId: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    setDataMap: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  columns = [
    { title: '名称', key: 'name', dataIndex: 'name' },
    {
      title: '匹配来源', key: 'from', dataIndex: 'from', render: from => {
        const d = dataMapFroms.getByKey(from);
        return d ? d.name : '未知';
      }
    },
    { title: '正则', key: 'regex', dataIndex: 'regex', render: regex => regex ? '是' : '否' },
    { title: '匹配规则', key: 'match', dataIndex: 'match' },
    { title: 'mock_id', key: 'mock_id', dataIndex: 'mock_id' },
    {
      title: '操作', key: 'action', render: (text, record) => (
        <span>
        <Icon type="edit" title="修改" onClick={() => this.handleEdit(record)}
              style={{ cursor: 'pointer' }}/>
        <Divider type="vertical"/>
        <Icon type="delete" title="删除" onClick={() => this.handleDelete(record.id)} style={{ cursor: 'pointer' }}/>
      </span>
      )
    },
  ];

  render() {
    const { data, dataMap } = this.props;

    return (
      <>
        <div style={{ marginBottom: 10 }}>
          <Button type="primary" size="small" onClick={this.handleCreate}>添加数据映射</Button>
        </div>
        <Table columns={this.columns} dataSource={data} rowKey="id" size="small" bordered={true} pagination={false}/>
        {dataMap.editing && <DataMapForm data={dataMap.data} saving={dataMap.saving} onCancel={this.handleCancel}
                                         onSave={this.handleSave}/>}
      </>
    )
  }

  handleCreate = () => {
    const { projectId, interfaceId, setDataMap } = this.props;
    setDataMap({
      editing: true,
      data: {
        project_id: projectId,
        interface_id: interfaceId,
        from: dataMapFroms.froms[0].key,
      }
    });
  };

  handleEdit = (dataMap) => {
    this.props.setDataMap({ editing: true, data: dataMap });
  };

  handleDelete = (id) => {
    const { onDelete } = this.props;

    Modal.confirm({
      title: '删除映射',
      content: '您确认要删除该数据映射规则吗？',
      onOk: () => {
        onDelete(id);
      }
    })
  };

  handleSave = (dataMap) => {
    const { onSave, dataMap: { saving } } = this.props;
    !saving && onSave(dataMap);
  };

  handleCancel = () => {
    this.props.setDataMap({ editing: false, saving: false });
  }
}

export default DataMapList;
