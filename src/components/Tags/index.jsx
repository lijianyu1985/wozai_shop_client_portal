/* eslint-disable no-unused-expressions */
import React from 'react';
import { Tag, Input } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        tags: props.value,
        inputVisible: false,
        inputValue: '',
      };
    } else {
      this.state = {
        tags: [],
        inputVisible: false,
        inputValue: '',
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ tags: nextProps.value });
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleClose = removedTag => {
    let { tags } = this.state;
    tags = tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    if (this.props.onBlur) {
      this.props.onBlur(tags);
    }
    if (this.props.onChange) {
      this.props.onChange(tags);
    }
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = e => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputValue: '',
    });
    if (e.type === 'blur') {
      this.setState({
        inputVisible: false,
      });
    }
    if (this.props.onBlur) {
      this.props.onBlur(tags);
    }
    if (this.props.onChange) {
      this.props.onChange(tags);
    }
  };

  // eslint-disable-next-line no-return-assign
  saveInputRef = input => (this.input = input);

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
            onKeyDown={event => {
              if (event.keyCode === 13) {
                event.preventDefault();
                return false;
              }
              return true;
            }}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} className="site-tag-plus">
            <PlusOutlined />
            添加
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
