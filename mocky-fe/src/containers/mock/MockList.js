import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import MockList from '../../components/mock/MockList';

class MockListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    itf: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, projectId, itf, data, edit } = this.props;

    if (fetching) {
      return (
        <div className="mock-list" style={{ width: 500 }}>
          <Spin />
        </div>
      );
    }

    return (
      <div className="mock-list" style={{ width: 500 }}>
        <MockList
          projectId={projectId}
          itf={itf}
          data={data}
          onDelete={this.deleteMock}
          onSave={this.saveMock}
          edit={edit}
          getMock={this.getMock}
          setEdit={this.setEdit}
        />
      </div>
    );
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
    const { itf, dispatch } = this.props;
    dispatch({ type: 'mock/getList', payload: itf.id });
  }

  deleteMock = id => {
    this.props.dispatch({ type: 'mock/delete', payload: id });
  };

  saveMock = mock => {
    this.props.dispatch({ type: 'mock/save', payload: mock });
  };

  getMock = (id) => {
    this.props.dispatch({ type: 'mock/getMock', payload: id });
  };

  setEdit = (edit) => {
    this.props.dispatch({ type: 'mock/edit', payload: edit });
  }
}

export default connect(state => ({ ...state.mock }))(MockListContainer);
