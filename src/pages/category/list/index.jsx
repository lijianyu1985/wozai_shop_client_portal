import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Table, Button, Card } from 'antd';
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
      dataIndex: 'description',
      key: 'name',
      render: text => text,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: text => text,
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
        selector: '_id name',
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
            selector: '_id name',
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
                rowKey={record => record.username}
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
