/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Table, Card } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

class OrderList extends Component {
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
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: text => text,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'order/page',
      payload: {
        size: pagination.pageSize || 10,
        page: pagination.current || 1,
        modelName: 'Order',
        selector: '_id orderNumber status',
      },
    });
  }

  componentDidUpdate() {
    const { pagination } = this.state;
    if (this.props.order.total !== pagination.total) {
      pagination.total = this.props.order.total;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ pagination });
    }
  }

  deleteItem = order => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'order/remove',
      payload: {
        modelName: 'Order',
        ids: [order._id],
      },
      callback: () => {
        this.handleTableChange(this.state.pagination);
      },
    });
  };

  editItem = order => {
    router.push({
      pathname: 'edit',
      query: {
        id: order._id,
      },
    });
  };

  editItemDetails = order => {
    router.push({
      pathname: 'editSku',
      query: {
        id: order._id,
      },
    });
  };

  handleTableChange = pagination => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const pager = { ...this.state.pagination };
    const {
      order: { total },
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
          type: 'order/page',
          payload: {
            size: pagination.pageSize || 10,
            page: pagination.current || 1,
            modelName: 'Order',
            selector: '_id orderNumber status',
          },
        });
      },
    );
  };

  render() {
    const {
      order: { list },
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

export default connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))(OrderList);
