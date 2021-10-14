import React, { useState } from 'react'
import styles from './index.scss'
import {Link} from 'react-router-dom'
import {
  Button,
  InputSearch,
  Table,
  Pagination,
} from '@kube-design/components'

export default class BlockPage extends React.Component {

  btnTransaction(){
    const { params } =this.props.children.match
    const {cluster, namespace} = params
    this.props.children.history.push(`/clusters/${cluster}/projects/${namespace}/moreTran`)
    // return <Link to={`/clusters/${cluster}/projects/${namespace}`}></Link>
  }
  btnBlock(){
    const { params } =this.props.children.match
    const {cluster, namespace} = params
    this.props.children.history.push(`/clusters/${cluster}/projects/${namespace}/moreBlock`)
  }
  render() {
    // console.log('====================================');
    // console.log(this.props);
    // console.log('====================================');
    // console.log(this.props.children);
    //
    // console.log(this.props.children.history);
    
    const dataSource = [
      {
        key: '1',
        name: '1',
        age: '0x3252354365463987452898',
        address: '0x325235436546398745289h',
      },
      {
        key: '2',
        name: '2',
        age: '0x32523543654639745288h',
        address: '0x325235436546397452898h',
      },
      {
        key: '23',
        name: '3',
        age: '0x325235436546397452898h',
        address: '0x325235436543987452898h',
      },
      {
        key: '4',
        name: '4',
        age: '0x325235436546398452898h',
        address: '0x325235436543987452898h',
      },
      {
        key: '5',
        name: '5',
        age: '0x32523543646387452898h',
        address: '0x32524365463987452898h',
      },
    ];
    
    const columns = [
      {
        title: '块高',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '哈希',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '父哈希',
        dataIndex: 'address',
        key: 'address',
      },
    ];
    return (

      <div className={styles.blockPages}>
        <div className={styles.block}>
          <Table rowKey="Block" columns={columns} title={t('Block')} dataSource={dataSource}   />
          <Button className={styles.buttonBlock} onClick={this.btnBlock.bind(this)}>更多</Button>
        </div>
        <div className={styles.transaction}>
          <Table rowKey="Transaction" columns={columns} dataSource={dataSource} title={t('Transaction')} />
          <Button className={styles.transactionBlock} onClick={this.btnTransaction.bind(this)}>更多</Button>
        </div>
      </div>
    );
  }
}




