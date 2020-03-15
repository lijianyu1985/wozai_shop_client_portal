import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

class CategoryEdit extends Component {
  state = {};

  handleSubmit = values => {
    const { dispatch } = this.props;
    router.push({
      pathname: 'list',
    });
    dispatch({
      type: 'category/create',
      payload: {
        modelName: 'Category',
        data: values,
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      },
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
      <PageHeaderWrapper content="" className={styles.main}>
        <Card bordered={false}>
          <Form onFinish={this.handleSubmit}>
            <Form.Item
              name="name"
              label="名称"
              {...formItemLayout}
              rules={[
                {
                  required: true,
                  message: '请输入名称!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="icon"
              label="图标"
              {...formItemLayout}
              rules={[
                {
                  required: true,
                  message: '请输入图标!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              {...formItemLayout}
              rules={[
                {
                  required: true,
                  message: '请输入描述!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              {...submitFormLayout}
              wrapperCol={{
                span: 12,
                offset: 6,
              }}
            >
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ category, loading }) => ({
  category,
  creating: loading.effects['category/create'],
}))(CategoryEdit);
