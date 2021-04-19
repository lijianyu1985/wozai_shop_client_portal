/* eslint-disable react/require-default-props */
// EditorConvertToHTML 组件
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BraftEditor from 'braft-editor';
import config from '../../../config/defaultSettings';
import 'braft-editor/dist/index.css';
import { buildPictureUrl } from '../../utils/utils';

const myUploadFn = param => {
  let serverURL = config.baseUrl;

  if (param.file.type) {
    if (param.file.type.toLowerCase().indexOf('image/') === 0) {
      serverURL += '/Images';
    } else if (param.file.type.toLowerCase().indexOf('video/') === 0) {
      serverURL += '/Videos';
    } else {
      serverURL += '/Docs';
    }
  }

  const xhr = new XMLHttpRequest();
  const fd = new FormData();

  const successFn = () => {
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    const responseObj = JSON.parse(xhr.responseText);
    param.success({
      url: buildPictureUrl(responseObj.filePath),
      width: '100%',
    });
  };

  const progressFn = event => {
    // 上传进度发生变化时调用param.progress
    param.progress((event.loaded / event.total) * 100);
  };

  const errorFn = () => {
    // 上传发生错误时调用param.error
    param.error({
      msg: 'unable to upload.',
    });
  };

  xhr.upload.addEventListener('progress', progressFn, false);
  xhr.addEventListener('load', successFn, false);
  xhr.addEventListener('error', errorFn, false);
  xhr.addEventListener('abort', errorFn, false);

  fd.append('file', param.file);
  xhr.open('POST', serverURL, true);
  xhr.send(fd);
};

const myValidateFn = file => {
  let maxSize = 3;
  if (file.type.toLowerCase().indexOf('video/') === 0) {
    maxSize = 30;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      if (file.size < 1024 * 1024 * maxSize) {
        resolve();
      } else {
        reject();
      }
    }, 2000);
  });
};

class EditorConvertToHTML extends Component {
  static propTypes = {
    // 同时在将 EditorState 传入渲染使用
    onChange: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(this.props.value || null),
    };
    this.handleBraftEditorChange = this.handleBraftEditorChange.bind(this);
    this.handleBraftBlur = this.handleBraftBlur.bind(this);
  }

  handleBraftEditorChange = editorState => {
    this.setState({
      editorState,
    });
    // this.props.onChange(editorState.toHTML());
    this.props.onChange(editorState.toHTML());
  };

  handleBraftBlur = editorState => {
    console.log('handleBraftBlur');
    console.log(editorState.toHTML());
    // this.props.onChange(editorState.toHTML());
  };

  render() {
    const { editorState } = this.state;
    const { disabled } = this.props;

    return (
      <div className="editor-wrapper">
        <BraftEditor
          media={{ uploadFn: myUploadFn, validateFn: myValidateFn }}
          readOnly={disabled}
          value={editorState}
          onChange={this.handleBraftEditorChange}
          onBlur={this.handleBraftBlur}
        />
      </div>
    );
  }
}

export default EditorConvertToHTML;
