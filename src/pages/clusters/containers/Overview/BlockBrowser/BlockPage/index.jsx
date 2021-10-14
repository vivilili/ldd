import React, { useState } from 'react'
import styles from './index.scss'
import {
  Button,
  InputSearch,
  Table,
  Pagination,
  pagination,
  setSelectedRowKeys,
  selectedRowKeys,
  isLoading,
  fetchList,
} from '@kube-design/components'

export default class BlockPage extends React.Component {

  render() {
    const rowSelection = {
      selectedRowKeys,
      onSelect: (record, checked, rowKeys) => {
        setSelectedRowKeys(rowKeys);
      },
      onSelectAll: (checked, rowKeys) => {
        setSelectedRowKeys(rowKeys);
      },
      // getCheckboxProps: record => ({
      //   disabled: record.node === 'node-4'
      // })
    };
    <div style={{
      display: "flex"
    }}>
      <InputSearch style={{
        flex: 1
      }} placeholder="please input a word" onSearch={name => fetchList({
        name
      })} />
      <Button style={{
        marginLeft: 12
      }} icon="refresh" type="flat" onClick={() => fetchList({
        pagination,
        filters,
        sorter
      })} />
    </div>;
    const footer = <Pagination {...pagination} onChange={page => fetchList({
      pagination: {
        ...pagination,
        page
      },
      filters,
      sorter
    })} />
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
      {
        key: '23',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
      {
        key: '4',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
      {
        key: '5',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];
    
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
    ];
    return (

      <div className={styles.blockPages}>
        <div className={styles.block}>
          {/* <InputSearch style={{
            flex: 1
          }} placeholder="please input a word" onSearch={name => fetchList({
            name
          })} /> */}
          {/* <Button style={{
            marginLeft: 12
          }} icon="refresh" type="flat" onClick={() => fetchList({
            pagination,
            filters,
            sorter
          })} /> */}
          <Table rowKey="Block" columns={columns} title="Block" dataSource={dataSource}  loading={isLoading} />
        </div>
        <div className={styles.transaction}>
          {/* <InputSearch placeholder="please input a word" onSearch={name => fetchList({
            name
          })} /> */}
          <Table rowKey="Transaction" columns={columns} dataSource={dataSource} title="Transaction" loading={isLoading}/>
        </div>
      </div>
    );
  }
}




