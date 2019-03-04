import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import userApi from '../api/user';

const Option = Select.Option;

class UserSelect extends PureComponent {
  state = {
    data: [],
    value: this.props.value,
    fetching: false,
  }

  render() {
    const { value, data, fetching } = this.state;
    const options = data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        filterOption={false}
        notFoundContent={fetching ? <Spin size="small" /> : null}
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

    const { excludes } = this.props;

    this.searchKey = value;
    this.setState({ data: [], fecthing: true });

    this.timer = setTimeout(() => {
      userApi.search(value).then(json => {
        if (this.searchKey === value) {
          let data = json.data.map(d => ({ text: d.nickname, value: d.id }));
          // 过滤排除项
          if (excludes && excludes.length > 0) {
            data = data.filter(d => {
              return !excludes.find(e => e.id === d.value);
            });
          }
          this.setState({ data: data, fecthing: false });
        }
      });
    }, 800);
  }

  handleChange = (value) => {
    this.setState({ value, data: [], fecthing: false, }, () => {
      const { onChange } = this.props;
      onChange && onChange(this.state.value);
    });
  }
}

export default UserSelect;