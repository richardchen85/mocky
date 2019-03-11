import React, {PureComponent} from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import './index.css';

class CodeArea extends PureComponent {
  render() {
    const {mode} = this.props;
    const isJSON = mode.name === 'javascript';

    return (
      <div className="code-area">
        {isJSON && <p><span className="fake-link" onClick={this.formatJSON}>格式化</span></p>}
        <textarea ref={$host => {
          this.$host = $host
        }}/>
      </div>
    )
  }

  componentDidMount() {
    const {value, mode, onChange} = this.props;

    this.cm = CodeMirror.fromTextArea(this.$host, {
      lineNumbers: true,
      lineWrapping: true,
      mode,
    });
    if (value) this.setValue(value);
    this.cm.on('change', () => {
      onChange(this.getCollapsedValue());
    });
  }

  formatJSON = () => {
    this.setValue(this.cm.getValue());
  }

  setValue(value) {
    const {mode} = this.props;
    const isJSON = mode.name === 'javascript';

    if (isJSON) {
      // json 格式先格式化
      try {
        const valueExpress = eval('(' + value + ')'); // eslint-disable-line no-eval
        const formated = JSON.stringify(valueExpress, null, 2);
        this.cm.setValue(formated);
      } catch (e) {
        console.warn('格式化JSON失败，尝试显示原内容', e);
        // 格式化失败，仍然显示内容
        this.cm.setValue(value);
      }
    } else {
      this.cm.setValue(value);
    }
  }

  getCollapsedValue = () => {
    return this.cm.getValue().replace(/\n|\s/g, '');
  }
}

export default CodeArea;
