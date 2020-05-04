import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

class CategoryEdit extends Component {
  state = {
    editing: false,
    categoryId: '',
  };

  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      categoryId: this.props.location.query.id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'category/resetCurrent',
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'category/get',
        payload: {
          modelName: 'Category',
          id: this.props.location.query.id,
          selector: '_id name icon description',
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.category.current !== prevProps.category.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = values => {
    const { dispatch } = this.props;
    const { editing, categoryId } = this.state;
    if (!editing) {
      dispatch({
        type: 'category/create',
        payload: {
          modelName: 'Category',
          data: values,
        },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    } else {
      dispatch({
        type: 'category/change',
        payload: {
          modelName: 'Category',
          data: values,
          id: categoryId,
        },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    }
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

    const {
      category: { current },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper content="" className={styles.main}>
        <Spin spinning={loading} size="large">
          <Card bordered={false}>
            <Form ref={this.formRef} initialValues={current} onFinish={this.handleSubmit}>
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
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ category, loading }) => ({
  category,
  loading: loading.models.category,
}))(CategoryEdit);
