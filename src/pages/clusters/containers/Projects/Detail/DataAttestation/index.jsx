import React from 'react'
import {
    Table,
    Button,
    isLoading,
    InputSearch,
    Pagination,
    Select,
    Banner,
} from '@kube-design/components'
import { MyPanel } from 'components/Base'
import styles from './index.scss'
import OpenData from './OpenData'
import { observer } from 'mobx-react'


@observer
class DataAttestation extends React.Component {
    state = {}
    renderEvidence(){
        return <OpenData />
    }
    

    render() {
        // let date = new Date();
        let date = '2021 - 8 - 10'
        const button1 = <Button type="primary" onClick={this.renderEvidence.bind(this)}>存证</Button>
        const button2 = <Button type="primary">取证</Button>
        const dataSource = []
        for (let i = 0; i < 10; i++) {
            dataSource.push({
                id: i+1,
                allianceName: 'BUPT',
                framework: 'fabric',
                channelName: 'BUPT',
                user: 'dxk',
                organization: 'fabric',
                status: '已开通',
                operation: [button1, button2]
            });
        }

        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '联盟名称',
                dataIndex: 'allianceName',
                key: 'allianceName',
            },
            {
                title: '联盟架构',
                dataIndex: 'framework',
                key: 'framework',
            },
            {
                title: '通道名称',
                dataIndex: 'channelName',
                key: 'channelName',
            },
            {
                title: '所属组织',
                dataIndex: 'organization',
                key: 'organization',
            },
            {
                title: '开通用户',
                dataIndex: 'user',
                key: 'user',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
            },
        ];

        const footer = <Pagination {...dataSource} /* onChange={page => fetchList({
            pagination: {
                ...pagination,
                page
            },
            filters,
            sorter
        })} */ />;
        
        // handleSearch = value => {
        //   this.searchValue = value
        //   this.fetchData({
        //     name: value,
        //   }).then(() => {
        //     this.props.onSearch(value)
        //   })
        // }

        // handleRefresh = () => {
        //   const params = this.searchValue ? { name: this.searchValue } : {}

        //   this.fetchData(params).then(() => {
        //     const { onSearch, onRefresh } = this.props
        //     isEmpty(params) ? onRefresh() : onSearch(this.searchValue)
        //   })
        // }
        return (
            <div>
                {/* <Select
                    name="select"
                    className={styles.select}
                    options={options}
                    value={1} /> */}
                <MyPanel title={t('DataAttestation')} className={styles.content} extras={'DataAttestation'}>
                    <div className={styles.header}>
                        <InputSearch
                            className={styles.search}
                            name="search"
                            placeholder={t('Filter by keyword')}
                        // onSearch={this.handleSearch}
                        />
                        <div className={styles.actions}>
                            <Button type="flat" icon="refresh"
                            // onClick={this.handleRefresh}
                            />
                        </div>
                    </div>
                    <Table rowKey="DataAttestation" columns={columns} dataSource={dataSource} loading={isLoading} footer={footer} />
                </MyPanel>
            </div>
        );

    }
}

export default DataAttestation;;