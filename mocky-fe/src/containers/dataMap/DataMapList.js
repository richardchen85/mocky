import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import DataMapList from '../../components/dataMap/DataMapList';

import { operations } from '../../redux/dataMap';

class DataMapListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    interfaceId: PropTypes.number.isRequired,
  }

  render() {
    const { fetching, data, projectId, interfaceId } = this.props;

    if (fetching) {
      return (
        <div className="dataMap-list" style={{width:600}}><Spin /></div>
      )
    }

    return (
      <div className="dataMap-list" style={{marginRight:15,width:600}}>
        <DataMapList projectId={projectId} interfaceId={interfaceId} data={data} onDelete={this.deleteDataMap} onSave={this.saveDataMap} />
      </div>
    )
  }

  componentDidMount() {
    this.getList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.interfaceId !== this.props.interfaceId) {
      this.getList();
    }
  }

  /**
   * 查询当前接口的所有映射规则
   */
  getList() {
    const { interfaceId, getList } = this.props;
    getList(interfaceId);
  }

  deleteDataMap = (id, callback) => {
    this.props.delete(id).then(() => {
      callback && callback();
      this.getList();
    }).catch(error => {
      callback && callback(error.message);
    });
  }

  saveDataMap = (dataMap, callback) => {
    const saveAction = dataMap.id ? this.props.update : this.props.create;
    saveAction(dataMap).then(json => {
      callback && callback();
      this.getList();
    }).catch(error => {
      callback && callback(error.message);
    });
  }
}

export default connect(
  state => ({
    ...state.dataMap.list,
  }),
  {
    getList: operations.getList,
    delete: operations.delete,
    create: operations.create,
    update: operations.update,
  }
)(DataMapListContainer);