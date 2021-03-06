/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Table, Button, Card, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

class CategoryList extends Component {
  state = {
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 10,
      page: 1,
    },
  };

  columns = [
    {
      title: '分类名',
      dataIndex: 'name',
      key: 'name',
      render: text => text,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: text => text,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: text => text,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            key="edit"
            onClick={e => {
              e.preventDefault();
              this.editItem(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteItem(record)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'category/page',
      payload: {
        size: pagination.pageSize || 10,
        page: pagination.current || 1,
        modelName: 'Category',
        selector: '_id name description icon',
      },
    });
  }

  componentDidUpdate() {
    const { pagination } = this.state;
    if (this.props.category.total !== pagination.total) {
      pagination.total = this.props.category.total;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ pagination });
    }
  }

  deleteItem = category => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'category/remove',
      payload: {
        modelName: 'Category',
        ids: [category._id],
      },
      callback: () => {
        this.handleTableChange(this.state.pagination);
      },
    });
  };

  editItem = category => {
    router.push({
      pathname: 'edit',
      query: {
        id: category._id,
      },
    });
  };

  handleTableChange = pagination => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const pager = { ...this.state.pagination };
    const {
      category: { total },
      dispatch,
    } = this.props;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    pager.total = total;
    this.setState(
      {
        pagination: pager,
      },
      () => {
        dispatch({
          type: 'category/page',
          payload: {
            size: pagination.pageSize || 10,
            page: pagination.current || 1,
            modelName: 'Category',
            selector: '_id name description icon',
          },
        });
      },
    );
  };

  render() {
    const {
      category: { list },
      loading,
    } = this.props;
    const { pagination } = this.state;

    return (
      <>
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title=""
              style={{
                marginTop: 24,
              }}
              bodyStyle={{
                padding: '0 32px 40px 32px',
              }}
            >
              <Button
                type="dashed"
                style={{
                  marginTop: 24,
                  width: '100%',
                  marginBottom: 8,
                }}
                icon={<PlusOutlined />}
                onClick={() =>
                  router.push({
                    pathname: 'edit',
                    query: {},
                  })
                }
              >
                添加
              </Button>
              <Table
                loading={loading}
                columns={this.columns}
                dataSource={list}
                pagination={pagination}
                // eslint-disable-next-line no-underscore-dangle
                rowKey={record => record._id}
                onChange={this.handleTableChange}
              />
            </Card>
          </div>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ category, loading }) => ({
  category,
  loading: loading.models.category,
}))(CategoryList);
