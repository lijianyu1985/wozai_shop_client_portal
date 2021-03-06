/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Table, Checkbox, InputNumber } from 'antd';

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  disabled,
  ...restProps
}) => {
  const save = async e => {
    try {
      if (dataIndex === 'archived') {
        handleSave(record, dataIndex, e.target.checked);
      } else {
        let parser = parseInt;
        if (dataIndex === 'price') {
          parser = parseFloat;
        }
        handleSave(record, dataIndex, parser(e.target.value));
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (dataIndex === 'archived') {
      childNode = (
        <Checkbox
          disabled={disabled}
          checked={(record && record[dataIndex]) || false}
          onChange={save}
        />
      );
    } else {
      childNode = (
        <InputNumber
          disabled={disabled}
          value={(record && record[dataIndex]) || 0}
          precision={dataIndex === 'price' ? 2 : 0}
          onBlur={save}
          onPressEnter={save}
        />
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '细分类',
        dataIndex: 'subdivide',
        render: item => item.map(i => `${i.kind}: ${i.value}`).join(', '),
      },
      {
        title: '库存',
        dataIndex: 'amount',
      },
      {
        title: '库存变化',
        dataIndex: 'amountVariation',
        editable: true,
      },
      {
        title: '价格',
        dataIndex: 'price',
        editable: true,
      },
      {
        title: '禁用',
        dataIndex: 'archived',
        editable: true,
      },
    ];
  }

  refresh = () => {
    this.setState({});
  };

  handleSave = (row, dataIndex, data) => {
    // eslint-disable-next-line no-unused-expressions
    if (this.props.updateSku) {
      this.props.updateSku(row._id, dataIndex, data);
    }
  };

  render() {
    const { skus } = this.props;
    const convertedSkus = (skus || []).map(v => ({
      ...v,
      key: v._id,
      amountVariation: v.amountVariation || 0,
    }));
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          disabled: this.props.disabled,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={convertedSkus}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;
