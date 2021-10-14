
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




export default class MoreTran  extends React.Component {

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
        id:'1',
        key: '1',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'2',
        key: '2',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'3',
        key: '3',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'4',
        key: '4',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'5',
        key: '5',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'6',
        key: '6',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {

        id:'7',
        key: '7',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
      {
        id:'8',
        key: '8',
        transationid: '9d54132f2704aea35a1425f4523ff981c0d8b050e98e65ca31faca246d3d5fdc',
        name:'fabric区块链',
        people:'ljw',
        place:'北京邮电大学',
        tel:'13778926524',
        source:'多源数据',
        description:'test',
        timestamp: '2021/08/09 20:47:04',
      },
    ];

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '交易ID',
        dataIndex: 'transationid',
        key: 'transationid',
      },
      {
        title: '存证名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '存证人员',
        dataIndex: 'people',
        key: 'people',
      },
      {
        title: '存证地点',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '联系方式',
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '数据来源',
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: '存证描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '交易时间戳',
        dataIndex: 'timestamp',
        key: 'timestamp',
      },

    ];



    return (

      <div className={styles.blockPages}>
        <div className={styles.transaction}>
          <Table rowKey="Transationdetail" columns={columns}  title={t('Transationdetail')} dataSource={dataSource}  loading={isLoading} />
        </div>
      </div>
    );
  }
}
