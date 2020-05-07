/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Button, Card, Spin, Radio, Row, Col, notification } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import lodash from 'lodash';
import styles from './index.less';
import SkuEditor from '../../../components/Sku/editor';
import { commodityStatusMap } from '../../../utils/const';

class CommodityEdit extends Component {
  updatedSkus = [];

  constructor(props) {
    super(props);
    this.state = {
      commodityId: '',
    };
    this.updateSku = this.updateSku.bind(this);
    this.updateSkus = this.updateSkus.bind(this);
    this.filterSkus = this.filterSkus.bind(this);
  }

  componentDidMount() {
    if (!this.props.location.query.id) {
      notification.error({
        message: '错误',
        description: '请选择商品',
      });
      router.push({
        pathname: 'list',
      });
      return;
    }
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      commodityId: this.props.location.query.id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'commodity/resetCurrent',
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'commodity/getSkus',
        payload: {
          id: this.props.location.query.id,
        },
        callback: response => {
          this.setState({
            skus: response && response.data && response.data.skus,
          });
        },
      });
    }
  }

  updateSku = (_id, dataIndex, value) => {
    const existingSku = this.updatedSkus.find(s => s._id === _id);
    const {skus} = this.state;
    if (existingSku) {
      existingSku[dataIndex] = value;
    } else {
      this.updatedSkus.push({
        _id,
        [dataIndex]: value,
      });
    }
    const existingStateSku = skus.find(s => s._id === _id);
    if (existingStateSku) {
      existingStateSku[dataIndex] = value;
    } 
    this.setState({
      skus
    });
  };

  updateSkus = () => {
    const { dispatch } = this.props;
    const { commodityId } = this.state;
    dispatch({
      type: 'commodity/changeSkus',
      payload: {
        skus: this.updatedSkus,
        id: commodityId,
      },
      callback: () => {
        this.updatedSkus.length = 0;
        dispatch({
          type: 'commodity/getSkus',
          payload: {
            id: commodityId,
          },
          callback: response => {
            this.setState({
              skus: response && response.data && response.data.skus,
            });
          },
        });
      },
    });
  };

  filterSkus = (sub, e) => {
    this.setState({
      skuFilters: {
        ...this.state.skuFilters,
        [sub.kind]: e.target.value,
      },
    });
  };

  render() {
    const {
      commodity: { skusCommodity },
      loading,
    } = this.props;
    const { skus, skuFilters } = this.state;

    let filteredSkus = skus;
    if (skuFilters) {
      lodash.forIn(skuFilters, (value, key) => {
        filteredSkus = lodash.filter(filteredSkus, s =>
          s.subdivide.some(a => (a.kind === key && a.value === value) || !value),
        );
      });
    }
    const isFormDisabled = commodityStatusMap.preOnline !== skusCommodity.status;

    return (
      <PageHeaderWrapper content="" className={styles.main}>
        <Spin spinning={loading} size="large">
          <Button
            onClick={() =>
              router.push({
                pathname: 'list',
              })
            }
          >
            返回
          </Button>
          <Card bordered={false}>
            {((skusCommodity && skusCommodity.subdivide) || []).map(sub => (
              <Row key={sub._id}>
                <Col span={6}>{sub.kind}</Col>
                <Col span={18}>
                  <Radio.Group
                    buttonStyle="solid"
                    style={{ paddingBottom: 20, width: '100%', whiteSpace: 'break-spaces' }}
                    onChange={val => this.filterSkus(sub, val)}
                  >
                    <Radio.Button value=''>空</Radio.Button>
                    {sub.valueList.map(v => (
                      <Radio.Button key={v} value={v}>
                        {v}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Col>
              </Row>
            ))}
          </Card>
          <Card bordered={false}>
            <Card bordered={false}>
              <Button
              disabled={isFormDisabled}
                style={{
                  float: 'right',
                }}
                type="primary"
                onClick={this.updateSkus}
              >
                更新
              </Button>
            </Card>
            {filteredSkus && filteredSkus.length && (
              <SkuEditor
              disabled={isFormDisabled}
                ref={skuEditor => {
                  this.skuEditor = skuEditor;
                }}
                updateSku={this.updateSku}
                skus={filteredSkus}
              />
            )}
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ commodity, loading }) => ({
  commodity,
  loading: loading.models.commodity,
}))(CommodityEdit);
