import React from 'react';
import { Table, Switch, Icon } from 'antd';

class UserList extends React.PureComponent {
  render() {
    const { fetching, data, page, status } = this.props;
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              loading={status.id === record.id && status.loading}
              checked={!!text}
              onClick={() => this.changeStatus(record.id, !text)}
            />
          );
        },
      },
      { title: '注册时间', dataIndex: 'create_time', key: 'create_time' },
      { title: '上次修改', dataIndex: 'update_time', key: 'update_time' },
    ];
    return (
      <div className={'user-list'}>
        <Table rowKey={'id'} columns={columns} dataSource={data} pagination={page} loading={fetching} />
      </div>
    );
  }

  changeStatus(id, status) {
    const { onStatusChange } = this.props;
    onStatusChange && onStatusChange(id, status);
  }
}

export default UserList;
