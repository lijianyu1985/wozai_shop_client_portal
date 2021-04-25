/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import {
  Descriptions,
  Card,
  Divider,
  List,
  Avatar,
  Timeline,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './index.less';
import { toDisplayTimestamp, jsonConvertToFlatten } from '../../../utils/utils';
import { orderStatusMap } from '../../../utils/const';

const toSubdivideString = sku => {
  const subdivide = [];
  if (sku) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < sku.subdivide.length; i++) {
      subdivide.push(sku.subdivide[i].value);
    }
  }
  return subdivide.join(', ');
};

const cancelableStatus = [orderStatusMap.Created, orderStatusMap.Paid];
const shippingableStatus = [orderStatusMap.Paid];
const refundableStatus = [orderStatusMap.Canceled, orderStatusMap.Returned];
const discountableStatus = [orderStatusMap.Canceled, orderStatusMap.Created];

class OrderView extends Component {
  state = {
    merchantAddress: {},
    isExpressModalVisible: false,
    isDiscountModalVisible: false,
  };

  formRef = React.createRef();

  discountFormRef = React.createRef();

  refreshCurrent = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/resetCurrent',
    });
    if (id) {
      dispatch({
        type: 'order/get',
        payload: {
          modelName: 'Order',
          id,
          selector: '_id orderNumber address commodityItems rate status description shipping',
        },
      });
    }
  };

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      orderId: this.props.location.query.id,
    });
    this.refreshCurrent(this.props.location.query.id);
  }

  cancelOrder = order => {
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'order/cancel',
      payload: {
        id: order._id,
      },
      callback: () => {
        this.refreshCurrent(order._id);
      },
    });
  };

  createExpressProcess = () => {
    // 弹框
    this.showExpressModal();
  };

  createExpress = () => {
    if (this.state.merchantAddress && this.state.merchantAddress.address) {
      this.createExpressProcess();
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'order/getMerchantAddress',
        payload: {},
        callback: res => {
          this.setState(
            {
              merchantAddress: res.address,
            },
            this.createExpressProcess,
          );
        },
      });
    }
  };

  showExpressModal = () => {
    this.setState({ isExpressModalVisible: true }, () => {
      this.formRef.current.setFieldsValue({
        'sender.province': this.state.merchantAddress.province,
        'sender.city': this.state.merchantAddress.city,
        'sender.county': this.state.merchantAddress.county,
        'sender.address': this.state.merchantAddress.address,
        'sender.name': this.state.merchantAddress.name,
        'sender.phone': this.state.merchantAddress.phone,
        'sender.zipCode': this.state.merchantAddress.zipCode,
      });
      if (this.props.order && this.props.order.current && this.props.order.current.address)
        this.formRef.current.setFieldsValue({
          'receiver.province': this.props.order.current.address.province,
          'receiver.city': this.props.order.current.address.city,
          'receiver.county': this.props.order.current.address.county,
          'receiver.address': this.props.order.current.address.address,
          'receiver.name': this.props.order.current.address.name,
          'receiver.phone': this.props.order.current.address.phone,
          'receiver.zipCode': this.props.order.current.address.zipCode,
        });
    });
  };

  handleExpressModalOk = () => {
    this.handleCreateExpress(this.formRef.current.getFieldsValue());
    this.setState({ isExpressModalVisible: false });
  };

  handleExpressModalCancel = () => {
    this.setState({ isExpressModalVisible: false });
  };

  handleCreateExpress = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/createShipping',
      payload: jsonConvertToFlatten({
        ...data,
        id: this.props.order.current._id,
      }),
      callback: () => {
        this.refreshCurrent(this.props.order.current._id);
      },
    });
  };

  applyDiscount = ({ discount }) => {
    const {
      order: { current },
    } = this.props;
    // eslint-disable-next-line no-console
    const { dispatch } = this.props;
    dispatch({
      type: 'order/applyDiscount',
      payload: {
        id: current._id,
        discount,
      },
      callback: () => {
        this.refreshCurrent(current._id);
      },
    });
  };

  handleDiscountModalOk = () => {
    this.applyDiscount(this.discountFormRef.current.getFieldsValue());
    this.setState({ isDiscountModalVisible: false });
  };

  handleDiscountModalCancel = () => {
    this.setState({ isDiscountModalVisible: false });
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
    const {
      order: { current },
    } = this.props;
    const { isExpressModalVisible, isDiscountModalVisible } = this.state;
    let count = 0;
    let weight = 0;
    if (current && current.commodityItems && current.commodityItems.length) {
      current.commodityItems.forEach(x => {
        count += x.count;
        weight += x.count * (x.commodity.weight || 0);
      });
    }
    return (
      <PageHeaderWrapper className={styles.pageHeader}>
        <div className={styles.main}>
          <GridContent>
            <Card
              title="订单"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                cancelableStatus.indexOf(
                  current.status && current.status.current && current.status.current.name,
                ) >= 0 ? (
                  <>
                    <Popconfirm
                      title="是否要取消当前订单？"
                      onConfirm={() => {
                        this.cancelOrder(current);
                      }}
                    >
                      <Button type="link">取消订单</Button>
                    </Popconfirm>
                  </>
                ) : (
                  <></>
                )
              }
            >
              <Descriptions
                title="基本信息"
                style={{
                  marginBottom: 32,
                }}
              >
                <Descriptions.Item label="订单编号">{current.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  {current.status && current.status.current && current.status.current.name}
                </Descriptions.Item>
              </Descriptions>
              <Divider
                style={{
                  marginBottom: 32,
                }}
              />
              <Descriptions title="产品列表" style={{}} />
              <List
                itemLayout="horizontal"
                dataSource={current.commodityItems}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.commodity.photo} />}
                      title={
                        <Link to={`/product/commodity/edit?id=${item.commodity._id}`}>
                          {item.commodity.name}
                        </Link>
                      }
                      description={toSubdivideString(item.sku)}
                    />
                    <div>
                      <span>￥{item.sku.price}</span>
                      <span style={{ marginLeft: 20 }}>
                        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>x</span>
                        {item.count}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </GridContent>
          <GridContent>
            <Card
              title="物流"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                current.address &&
                !current.shipping &&
                shippingableStatus.indexOf(
                  current.status && current.status.current && current.status.current.name,
                ) >= 0 && (
                  <>
                    <Button type="link" onClick={this.createExpress}>
                      填写快递单
                    </Button>
                  </>
                )
              }
            >
              {current.address ? (
                <>
                  <Descriptions style={{}}>
                    <Descriptions.Item label="姓名">{current.address.name}</Descriptions.Item>
                    <Descriptions.Item label="电话">{current.address.phone}</Descriptions.Item>
                    <Descriptions.Item label="地址">{`${current.address.province},${current.address.city},${current.address.county},${current.address.address}`}</Descriptions.Item>
                  </Descriptions>
                </>
              ) : (
                <span>--</span>
              )}
              {current.shipping && (
                <>
                  <Divider style={{}} />
                  <Descriptions
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    <Descriptions.Item label="快递单号">{current.orderNumber}</Descriptions.Item>
                    <Descriptions.Item label="快递公司">顺丰</Descriptions.Item>
                  </Descriptions>
                  <Descriptions title="物流记录" style={{}}>
                    <Descriptions.Item label="状态">已完成</Descriptions.Item>
                  </Descriptions>
                  <Timeline>
                    {current.shipping.items.map(x => (
                      <Timeline.Item>
                        {x.status} {toDisplayTimestamp(x.timestamp)}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </>
              )}
            </Card>
          </GridContent>
          <GridContent>
            <Card
              title="支付信息（如果已经取消订单，设置退款按钮，退款需要扣除费用？）"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              extra={
                <>
                  {refundableStatus.indexOf(
                    current.status && current.status.current && current.status.current.name,
                  ) >= 0 && <Button type="link">退款</Button>}
                  {discountableStatus.indexOf(
                    current.status && current.status.current && current.status.current.name,
                  ) >= 0 && (
                    <Button
                      type="link"
                      onClick={() =>
                        this.setState({
                          isDiscountModalVisible: true,
                        })
                      }
                    >
                      输入优惠金额
                    </Button>
                  )}
                </>
              }
            >
              {current.rate && (
                <Descriptions style={{}}>
                  <Descriptions.Item label="商品费用">
                    ￥{current.rate.commodityCost}
                  </Descriptions.Item>
                  <Descriptions.Item label="快递费用">
                    ￥{current.rate.shippingFee}
                  </Descriptions.Item>
                  <Descriptions.Item label="优惠">￥{current.rate.discount}</Descriptions.Item>
                  <Descriptions.Item label="总费用">￥{current.rate.total}</Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </GridContent>
        </div>
        <Modal
          width="90%"
          title="新建快递单"
          visible={isExpressModalVisible}
          onOk={this.handleExpressModalOk}
          onCancel={this.handleExpressModalCancel}
        >
          <Form ref={this.formRef}>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="寄件人信息">
                  <Form.Item name="sender.province" label="省" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.city" label="市" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.county" label="区县" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.address" label="详细地址" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.zipCode" label="邮编" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.phone" label="电话" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="sender.name" label="姓名" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="收件人信息">
                  <Form.Item name="receiver.province" label="省" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.city" label="市" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.county" label="区县" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.address" label="详细地址" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.zipCode" label="邮编" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.phone" label="电话" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="receiver.name" label="姓名" {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card style={{ marginTop: 16 }} title="快件信息">
                  <Form.Item name="count" label="件数" initialValue={count} {...formItemLayout}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="weight" label="重量" initialValue={weight} {...formItemLayout}>
                    <Input />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="给与优惠"
          visible={isDiscountModalVisible}
          onOk={this.handleDiscountModalOk}
          onCancel={this.handleDiscountModalCancel}
        >
          <Form ref={this.discountFormRef}>
            <Row>
              <Col span={24}>
                <Form.Item name="discount" label="优惠" {...formItemLayout}>
                  <InputNumber
                    style={{
                      width: 150,
                    }}
                    min="0"
                    step="0.01"
                    stringMode
                    precision={2}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))(OrderView);
