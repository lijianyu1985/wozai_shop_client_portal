/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Card, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';

const data = [
  {
    kind: 'Ant Design Title 1',
    valueList: ['1', '2', '3'],
  },
];

class SubdivideEditor extends Component {
  static propTypes = {
    // 同时在将 EditorState 传入渲染使用
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    if (props.value) {
      this.state = {
        tags: ['Tag 1', 'Tag 2', 'Tag 3'],
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

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

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
      <Card bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.kind}>
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
                    />
                  )}
                  {!inputVisible && (
                    <Tag onClick={this.showInput} className="site-tag-plus">
                      <PlusOutlined /> New Tag
                    </Tag>
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default SubdivideEditor;
