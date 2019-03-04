import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import MockList from '../../components/mock/MockList';

import { operations } from '../../redux/mock';

class MockListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
  };

  render() {
    const { projectId, itf, fetching, data, getById } = this.props;

    if (fetching) {
      return (
        <div className="mock-list" style={{width:500}}><Spin /></div>
      )
    }

    return (
      <div className="mock-list" style={{width:500}}>
        <MockList projectId={projectId} itf={itf} data={data} onDelete={this.deleteMock} onSave={this.saveMock} getById={getById} />
      </div>
    )
  }

  componentDidMount() {
    this.getList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.itf !== this.props.itf) {
      this.getList();
    }
  }

  getList() {
    const { itf, getList } = this.props;
    getList(itf.id);
  }

  deleteMock = (id) => {
    this.props.delete(id).then(() => {
      this.getList();
    }).catch(error => {
      console.error(error);
    });
  };

  saveMock = (mock, callback) => {
    const action = mock.id ? this.props.update : this.props.create;
    action(mock).then(() => {
      callback && callback();
      this.getList();
    }).catch(error => {
      callback && callback(error.message);
    });
  }
}

export default connect(
  state => ({
    ...state.mock.list,
  }),
  {
    getList: operations.getList,
    delete: operations.delete,
    create: operations.create,
    update: operations.update,
    getById: operations.getById,
  }
)(MockListContainer);
