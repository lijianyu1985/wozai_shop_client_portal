/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Table, Card, Form, Input, Select, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';
import { buildAddress, clearEmptyFields } from '../../../utils/utils';
import { orderStatus } from '../../../utils/const';

const projection = '_id orderNumber status address rate';

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
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => status && status.current && status.current.name,
    },
    {
      title: '目标地址',
      dataIndex: 'address',
      key: 'address',
      render: address => buildAddress(address) || '--',
    },
    {
      title: '目标电话',
      dataIndex: 'address',
      key: 'address_phone',
      render: address => (address && address.phone) || '--',
    },
    {
      title: '目标姓名',
      dataIndex: 'address',
      key: 'address_name',
      render: address => (address && address.name) || '--',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      render: description => description,
    },
    {
      title: '运费',
      dataIndex: 'rate',
      key: 'rate_shippingFee',
      render: rate => rate.shippingFee,
    },
    {
      title: '总金额',
      dataIndex: 'rate',
      key: 'rate_total',
      render: rate => rate.total,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a
            key="viewOrder"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              this.viewItem(e, record);
            }}
          >
            查看
          </a>
          {/* <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => { }}>
            <a>取消订单</a>
          </Popconfirm> */}
        </span>
      ),
    },
  ];

  formRef = React.createRef();

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'order/page',
      payload: {
        size: pagination.pageSize || 10,
        page: pagination.current || 1,
        modelName: 'Order',
        selector: projection,
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

  viewItem = (e, order) => {
    router.push({
      pathname: 'view',
      query: {
        id: order._id,
      },
    });
  };

  handleSearch = query => {
    // eslint-disable-next-line no-unused-expressions
    const { dispatch } = this.props;
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState(
      {
        pagination,
      },
      () => {
        dispatch({
          type: 'order/page',
          payload: {
            size: pagination.pageSize || 10,
            page: pagination.current || 1,
            modelName: 'Order',
            selector: projection,
            query: clearEmptyFields(query),
          },
        });
      },
    );
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
            selector: projection,
            query: clearEmptyFields(this.formRef.current.getFieldsValue()),
          },
        });
      },
    );
  };

  handleFormReset = () => {
    this.formRef.current.resetFields();
  };

  renderSimpleForm() {
    return (
      <Form
        ref={this.formRef}
        onFinish={this.handleSearch}
        layout="inline"
        className={styles['search-form']}
      >
        <Form.Item name="orderNumber" label="订单编号">
          <Input />
        </Form.Item>
        <Form.Item name="status.current.name" label="订单状态">
          <Select placeholder="请选择订单状态">
            {(orderStatus || []).map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="address.name" label="客户名">
          <Input />
        </Form.Item>
        <Form.Item name="address.phone" label="客户电话">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            onClick={this.handleFormReset}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    const {
      order: { list },
      loading,
    } = this.props;
    const { pagination } = this.state;

    return (
      <>
        <PageHeaderWrapper>
          <Card bordered={false}>{this.renderSimpleForm()}</Card>
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
                onRow={record => {
                  return {
                    onClick: event => {
                      this.viewItem(event, record);
                    }, // click row
                  };
                }}
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
