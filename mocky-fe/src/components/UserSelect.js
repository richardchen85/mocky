import React, {PureComponent} from 'react';
import {Select, Spin} from 'antd';
import {get} from '../utils/fetch';
import {AUTH} from '../constants/url';

const Option = Select.Option;

class UserSelect extends PureComponent {
  state = {
    data: [],
    value: this.props.value,
    fetching: false,
  };

  render() {
    const {value, data, fetching} = this.state;
    const options = data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" style={{marginLeft:5}}/> : null}
        style={this.props.style}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
      >
        {options}
      </Select>
    );
  }

  handleSearch = (value) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (!value) return;

    const {excludes} = this.props;

    this.searchKey = value;
    this.setState({data: [], fetching: true});

    this.timer = setTimeout(() => {
      get(AUTH.SEARCH + value).then(json => {
        if (this.searchKey === value) {
          let data = json.data.map(d => ({text: d.nickname, value: d.id}));
          // 过滤排除项
          if (excludes && excludes.length > 0) {
            data = data.filter(d => {
              return !excludes.find(e => e.id === d.value);
            });
          }
          this.setState({data: data, fetching: false});
        }
      });
    }, 800);
  };

  handleChange = (value) => {
    this.setState({value, data: [], fetching: false,}, () => {
      const {onChange} = this.props;
      onChange && onChange(this.state.value);
    });
  }
}

export default UserSelect;
