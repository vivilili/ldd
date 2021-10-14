
import React from 'react'
import {
  Table,
  Button,
  isLoading,
} from '@kube-design/components'
import { MyPanel } from 'components/Base'
import styles from './index.scss'
class BlockDetail extends React.Component {
  state = {}
  render() {
    const dataSource1 = [
      {
        key: '1',
        height: '1',
        hash: '0x3252354365463987452898',
        previoushash: '0x325235436546398745289h',
        datahash: '0x365235436546398745289h',
        transactionnumber: '1',
      },
    ];

    const dataSource2 = [
      {
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
    ];
    const columns1 = [
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
    ];

    const columns2 = [

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
     <div>
       <MyPanel className={styles.content} >
         <div className={styles.title}>＞ 区块详情</div>
         <Table className={styles.table} rowKey="Blockdetail" columns={columns1} dataSource={dataSource1} loading={isLoading} />
       </MyPanel>

       <div  className={styles.content}>
         <div className={styles.title}>＞ 交易详情</div>
         <Table rowKey="Transactiondetail" columns={columns2} dataSource={dataSource2} loading={isLoading} />
       </div>



     </div>



    );
  }
}

export default BlockDetail;