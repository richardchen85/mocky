import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import DataMapList from '../../components/dataMap/DataMapList';
import { types } from '../../redux/model/dataMap';

class DataMapListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    interfaceId: PropTypes.number.isRequired,
  };

  render() {
    const { fetching, data, projectId, interfaceId, edit } = this.props;

    if (fetching) {
      return (
        <div className="dataMap-list" style={{ width: 600 }}>
          <Spin />
        </div>
      );
    }

    return (
      <div className="dataMap-list" style={{ marginRight: 15, width: 600 }}>
        <DataMapList
          projectId={projectId}
          interfaceId={interfaceId}
          data={data}
          setEdit={this.setEdit}
          edit={edit}
          onDelete={this.deleteDataMap}
          onSave={this.saveDataMap}
        />
      </div>
    );
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
    const { interfaceId, dispatch } = this.props;
    dispatch({ type: types.getList, payload: interfaceId });
  }

  deleteDataMap = id => {
    this.props.dispatch({ type: types.delete, payload: id });
  };

  setEdit = (edit) => {
    this.props.dispatch({ type: types.edit, payload: edit });
  };

  saveDataMap = dataMap => {
    this.props.dispatch({ type: types.save, payload: dataMap });
  };
}

export default connect(state => ({ ...state.dataMap }))(DataMapListContainer);
