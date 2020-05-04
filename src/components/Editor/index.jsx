/* eslint-disable react/require-default-props */
// EditorConvertToHTML 组件
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import config from '../../../config/defaultSettings';
import { buildPictureUrl } from '../../utils/utils';

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${config.baseUrl}/Images`);
    const data = new FormData();
    data.append('file', file);
    xhr.send(data);
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      resolve({ data: { link: response && buildPictureUrl(response.filePath) } });
    });
    xhr.addEventListener('error', () => {
      const error = JSON.parse(xhr.responseText);
      reject(error);
    });
  });
}

function convertHtmlToEditorState(html) {
  if (!html) {
    return EditorState.createEmpty();
  }
  const parsedHtml = htmlToDraft(html);
  if (!parsedHtml) {
    return EditorState.createEmpty();
  }
  const { contentBlocks, entityMap } = parsedHtml;
  if (!contentBlocks) {
    return EditorState.createEmpty();
  }
  return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));
}

class EditorConvertToHTML extends Component {
  static propTypes = {
    // 同时在将 EditorState 传入渲染使用
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        editorState: convertHtmlToEditorState(props.value),
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }

  /* componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        editorState: convertHtmlToEditorState(nextProps.value),
      });
    }
  } */

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
    this.props.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  }

  render() {
    const { editorState } = this.state;

    return (
      <Editor
        localization={{ locale: 'zh' }}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
    );
  }
}

export default EditorConvertToHTML;
