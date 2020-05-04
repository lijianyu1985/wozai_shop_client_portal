import React, { useState } from 'react';
import { Table, Input, Popconfirm, Form, Button, Divider } from 'antd';
import EditableTagGroup from '../Tags';
import './table.less';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'valueList' ? (
      <EditableTagGroup />
    ) : (
      <Input
        onKeyDown={event => {
          if (event.keyCode === 13) {
            event.preventDefault();
            return false;
          }
          return true;
        }}
      />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState((value || []).map((v, key) => ({ ...v, key })));
  const [editingKey, setEditingKey] = useState('');

  const isEditing = record => record.key === editingKey;

  const update = val => {
    onChange(val.map(v => ({ kind: v.kind, valueList: v.valueList })));
    setData(val);
  };

  const edit = record => {
    form.setFieldsValue({
      kind: '类型',
      valueList: [],
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        update(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        update(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = key => {
    const dataSource = [...data];
    update(dataSource.filter(item => item.key !== key));
  };

  const handleAdd = () => {
    cancel();
    const count = (data && data.length) || 0;
    const newData = {
      key: count,
      kind: '类型',
      valueList: [],
    };
    if (data && data.length) {
      update([...data, newData]);
    } else {
      update([newData]);
    }
  };

  const columns = [
    {
      title: '类型',
      dataIndex: 'kind',
      editable: true,
    },
    {
      title: '类型数据值',
      dataIndex: 'valueList',
      editable: true,
      render: item => item && item.join(', '),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <a
              onClick={() => cancel()}
              style={{
                marginRight: 8,
              }}
            >
              取消
            </a>
          </span>
        ) : (
          <span>
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </a>
            <Divider />
            <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.key)}>
              <a disabled={editingKey !== ''}>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增类型
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </div>
  );
};

export default EditableTable;
