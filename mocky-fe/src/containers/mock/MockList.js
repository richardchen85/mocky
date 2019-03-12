import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import MockList from '../../components/mock/MockList';

import { actions } from '../../redux/mock';

class MockListContainer extends PureComponent {
  static propTypes = {
    projectId: PropTypes.number.isRequired,
    itf: PropTypes.object.isRequired,
  };

  render() {
    const { fetching, projectId, itf, data, mock, getMock, setMock } = this.props;

    if (fetching) {
      return (
        <div className="mock-list" style={{ width: 500 }}><Spin/></div>
      )
    }

    return (
      <div className="mock-list" style={{ width: 500 }}>
        <MockList projectId={projectId} itf={itf} data={data} onDelete={this.deleteMock} onSave={this.saveMock}
                  mock={mock} getMock={getMock} setMock={setMock}/>
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
    this.props.delete(id);
  };

  saveMock = (mock) => {
    mock.id ? this.props.update(mock) : this.props.create(mock);
  }
}

export default connect(
  state => ({
    ...state.mock.list,
  }),
  {
    getList: actions.getList,
    delete: actions.delete,
    getMock: actions.getMock,
    setMock: actions.setMock,
    create: actions.create,
    update: actions.update,
  }
)(MockListContainer);
