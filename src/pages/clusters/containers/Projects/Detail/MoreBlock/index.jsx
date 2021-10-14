
import React from 'react'
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


export default class MoreBlock  extends React.Component {

  btn1Button = () => {
    const { params } =this.props.match
    const {cluster, namespace} = params
    this.props.history.push(`/clusters/${cluster}/projects/${namespace}/blockDetail`)
    
  }

  render() {
    const button1 = <Button type="primary" onClick={this.btn1Button.bind(this)}>区块详情</Button>
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
        height: '1',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation: button1,
      },
      {
        key: '2',
        height: '2',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '3',
        height: '3',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '4',
        height: '4',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '5',
        height: '5',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '6',
        height: '6',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '7',
        height: '7',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '8',
        height: '8',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '9',
        height: '9',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '10',
        height: '10',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '11',
        height: '11',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },
      {
        key: '12',
        height: '12',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
        operation:button1,
      },

    ];

    const columns = [
      {
        title: '区块高度',
        dataIndex: 'height',
        key: 'height',
      },
      {
        title: '区块哈希',
        dataIndex: 'hash',
        key: 'hash',
      },
      {
        title: '区块父哈希',
        dataIndex: 'previoushash',
        key: 'previoushash',
      },
      {
        title: '区块数据哈希',
        dataIndex: 'datahash',
        key: 'datahash',
      },
      {
        title: '区块交易数量',
        dataIndex: 'transactionnumber',
        key: 'transactionnumber',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
      },
    ];



    return (

      <div className={styles.blockPages}>
        <div className={styles.block}>
          <Table rowKey="Blockdetail" columns={columns} title={t('Blockdetail')} dataSource={dataSource}  loading={isLoading} />
        </div>
      </div>
    );
  }
}
