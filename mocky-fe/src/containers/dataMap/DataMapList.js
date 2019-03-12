import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import DataMapList from '../../components/dataMap/DataMapList';

import { actions } from '../../redux/dataMap';

class DataMapListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    interfaceId: PropTypes.number.isRequired,
  };

  render() {
    const { fetching, data, projectId, interfaceId, dataMap, setDataMap } = this.props;

    if (fetching) {
      return (
        <div className="dataMap-list" style={{ width: 600 }}><Spin/></div>
      )
    }

    return (
      <div className="dataMap-list" style={{ marginRight: 15, width: 600 }}>
        <DataMapList projectId={projectId} interfaceId={interfaceId} data={data} setDataMap={setDataMap}
                     dataMap={dataMap} onDelete={this.deleteDataMap} onSave={this.saveDataMap}/>
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

  deleteDataMap = (id) => {
    this.props.delete(id);
  };

  saveDataMap = (dataMap) => {
    dataMap.id ? this.props.update(dataMap) : this.props.create(dataMap);
  }
}

export default connect(
  state => ({
    ...state.dataMap.list,
  }),
  {
    getList: actions.getList,
    setDataMap: actions.setDataMap,
    delete: actions.delete,
    create: actions.create,
    update: actions.update,
  }
)(DataMapListContainer);
