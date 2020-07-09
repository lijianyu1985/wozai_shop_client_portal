/* eslint-disable no-underscore-dangle */
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Spin,
  Select,
  Upload,
  Modal,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import lodash from 'lodash';
import styles from './index.less';
import config from '../../../../config/defaultSettings';
import { getBase64, buildPictureUrl, trimBaseUrl } from '../../../utils/utils';
import { commodityStatusMap } from '../../../utils/const';
import Editor from '../../../components/Editor';
import SubdivideEditor from '../../../components/Subdivide/table';

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    notification.error({
      message: '错误',
      description: '文件必须小于2M',
    });
  }
  return isLt2M;
}

class CommodityEdit extends Component {
  state = {
    editing: false,
    commodityId: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    coverList: [],
  };

  formRef = React.createRef();

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      editing: !!this.props.location.query.id,
      commodityId: this.props.location.query.id,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'commodity/queryAllCategories',
      payload: {
        modelName: 'Category',
        selector: '_id name icon',
      },
    });
    dispatch({
      type: 'commodity/resetCurrent',
    });
    if (this.props.location.query.id) {
      dispatch({
        type: 'commodity/get',
        payload: {
          modelName: 'Commodity',
          id: this.props.location.query.id,
          selector:
            '_id name code brand categoryId photos coverPhotos description subdivide status',
        },
        callback: response => {
          const photos = (response && response.data && response.data.photos) || [];
          const fileList = (photos || []).map((url, index) => ({
            uid: index,
            status: 'done',
            name: url.substring(52),
            url: buildPictureUrl(url),
          }));
          const coverPhotos = (response && response.data && response.data.coverPhotos) || [];
          const coverList = (coverPhotos || []).map((url, index) => ({
            uid: index,
            status: 'done',
            name: url.substring(52),
            url: buildPictureUrl(url),
          }));
          this.setState({ fileList, coverList });
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.commodity.current !== prevProps.commodity.current) {
      this.formRef.current.resetFields();
    }
  }

  handleSubmit = values => {
    const { dispatch } = this.props;
    const { editing, commodityId, fileList, coverList } = this.state;
    const photos = (fileList || []).map(
      i => i && ((i.response && i.response.filePath) || trimBaseUrl(i.url)),
    );
    const coverPhotos = (coverList || []).map(
      i => i && ((i.response && i.response.filePath) || trimBaseUrl(i.url)),
    );
    const { status, ...postValues } = values;
    if (!editing) {
      dispatch({
        type: 'commodity/create',
        payload: {
          ...postValues,
          photos,
          coverPhotos,
        },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    } else {
      dispatch({
        type: 'commodity/change',
        payload: {
          ...postValues,
          photos,
          coverPhotos,
          id: commodityId,
        },
        callback: () => {
          router.push({
            pathname: 'list',
          });
        },
      });
    }
  };

  handleImagePreviewCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    if (file.size / 1024 / 1024 < 2) {
      this.setState({ fileList });
    }
  };

  handleRemove = file => {
    const { fileList } = this.state;
    const newFileList = lodash.filter(fileList, x => x.uid !== file.uid);
    this.setState({ fileList: newFileList });
  };

  handleCoverChange = ({ file, fileList }) => {
    if (file.size / 1024 / 1024 < 2) {
      this.setState({ coverList: lodash.filter(fileList, f => f.uid === file.uid) });
    }
  };

  publish = () => {
    const { dispatch } = this.props;
    const { commodityId } = this.state;
    dispatch({
      type: 'commodity/publish',
      payload: {
        id: commodityId,
      },
      callback: () => {
        location.reload();
      },
    });
  };

  withdraw = () => {
    const { dispatch } = this.props;
    const { commodityId } = this.state;
    dispatch({
      type: 'commodity/withdraw',
      payload: {
        id: commodityId,
      },
      callback: () => {
        location.reload();
      },
    });
  };

  discard = () => {
    const { dispatch } = this.props;
    const { commodityId } = this.state;
    dispatch({
      type: 'commodity/discard',
      payload: {
        id: commodityId,
      },
      callback: () => {
        location.reload();
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

    const {
      commodity: { current, allCategories },
      loading,
    } = this.props;
    const {commodityId} =this.state;

    const { editing, previewVisible, previewImage, fileList, coverList } = this.state;
    const isFormDisabled = commodityStatusMap.preOnline !== current.status && commodityId;
    return (
      <PageHeaderWrapper content="" className={styles.main}>
        <Spin spinning={loading} size="large">
          <Card bordered={false}>
            <Button
              style={{
                float: 'left',
              }}
              onClick={() =>
                router.push({
                  pathname: 'list',
                })
              }
            >
              返回
            </Button>
            <div
              style={{
                float: 'right',
              }}
            >
              {commodityStatusMap.preOnline === current.status && (
                <Popconfirm title="确定要上线吗？" onConfirm={this.publish}>
                  <Button style={{ marginRight: 10 }} type="primary">
                    上线
                  </Button>
                </Popconfirm>
              )}
              {commodityStatusMap.online === current.status && (
                <Popconfirm title="确定要下线吗？" onConfirm={this.withdraw}>
                  <Button style={{ marginRight: 10 }} type="primary">
                    下线
                  </Button>
                </Popconfirm>
              )}
              {commodityStatusMap.preOnline === current.status && (
                <Popconfirm title="确定要废除吗？" onConfirm={this.discard}>
                  <Button danger style={{ marginRight: 10 }} type="primary" >
                    废除
                  </Button>
                </Popconfirm>
              )}
            </div>
          </Card>
          <Card bordered={false}>
            <Form
              ref={this.formRef}
              initialValues={current}
              onFinish={this.handleSubmit}
            >
              <Form.Item name="code" label="编码" {...formItemLayout} rules={[]}>
                <Input disabled={editing} />
              </Form.Item>
              <Form.Item name="status" label="状态" {...formItemLayout} rules={[]}>
                <Input disabled />
              </Form.Item>
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
                <Input disabled={isFormDisabled}/>
              </Form.Item>
              <Form.Item
                name="brand"
                label="品牌"
                {...formItemLayout}
                rules={[
                  {
                    required: true,
                    message: '请输入品牌名!',
                  },
                ]}
              >
                <Input disabled={isFormDisabled}/>
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="分类"
                {...formItemLayout}
                rules={[
                  {
                    required: true,
                    message: '请选择分类!',
                  },
                ]}
              >
                <Select disabled={isFormDisabled} placeholder="请选择分类">
                  {(allCategories || []).map(item => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="coverPhotos"
                label="封面"
                {...formItemLayout}
                rules={[
                  {
                    required: true,
                    message: '请选上传面!',
                  },
                ]}
              >
                <Upload
                disabled={isFormDisabled}
                  showUploadList={{
                    showRemoveIcon: false,
                  }}
                  listType="picture-card"
                  className="avatar-uploader"
                  action={`${config.baseUrl}/Images`}
                  beforeUpload={beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleCoverChange}
                  fileList={coverList}
                >
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">上传</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                name="photos"
                label="图片"
                {...formItemLayout}
                rules={[
                  {
                    required: true,
                    message: '请上传图片!',
                  },
                ]}
              >
                <Upload
                disabled={isFormDisabled}
                  accept="image/*"
                  action={`${config.baseUrl}/Images`}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                  beforeUpload={beforeUpload}
                  multiple
                >
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">上传</div>
                  </div>
                </Upload>
              </Form.Item>
              <Form.Item
                name="subdivide"
                label="细分类"
                {...formItemLayout}
                rules={[
                  {
                    validator: (rule, value) => {
                      if (
                        value &&
                        value.length &&
                        value.every(v => v.kind && v.valueList && v.valueList.length)
                      ) {
                        if (lodash.uniqBy(value, 'kind').length === value.length) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('细分类数据重复!'));
                      }
                      return Promise.reject(new Error('细分类数据错误!'));
                    },
                  },
                  {
                    required: true,
                    message: '请输入细分类!',
                  },
                ]}
              >
                <SubdivideEditor disabled={isFormDisabled}/>
              </Form.Item>
              <Form.Item
                name="description"
                label="详情"
                {...formItemLayout}
                rules={[
                  {
                    required: true,
                    message: '请输入详情!',
                  },
                ]}
              >
                <Editor disabled={isFormDisabled}/>
              </Form.Item>
              <Form.Item
                {...submitFormLayout}
                wrapperCol={{
                  span: 12,
                  offset: 6,
                }}
              >
                <Button disabled={isFormDisabled} type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Spin>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleImagePreviewCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ commodity, loading }) => ({
  commodity,
  loading: loading.models.commodity,
}))(CommodityEdit);
