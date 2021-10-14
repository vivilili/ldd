import React from 'react'
import {
    isLoading,
} from '@kube-design/components'
import { MyPanel, Status } from 'components/Base'
//1 引入store
import clusterStore from "stores/monitoring/cluster"
import { toJS } from "mobx";
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { getLocalTime } from 'utils'
import styles from './index.scss'
@withList({
    store: new clusterStore(),
    name: 'chainCode',
    module: 'chainCode',
})
class ChainCode extends React.Component {
    monitoringStore = new clusterStore()
    //获取record  用于列表展示
    showAction = record => !record.isFedManaged
    //a 在state中定义需要通信的属性
    state = {
        msg: {
            chainCodeLanguage: '',
            description: '',
            chainCodeFile: ''
        },
        pagination: {
            page: 1,
            limit: 4
        }
    }

    getChildMsg = (msg) => {
        // console.log(msg);
        this.setState({
            msg
        })
    }
    //4 使用getData获取数据
    getData = async ({ }) => {  
        //5 在cluster.js中写调用接口的api
        const { namespace } = this.props.match.params
        const params = {
            namespace: namespace,
        }
        await this.monitoringStore.getDeployChainCode({
            params
        })
    }

    get itemActions() {
        const { trigger, routing } = this.props
        const { namespace, cluster } = this.props.match.params
        const { username } = globals.user
        // this.props.history.push(`/clusters/${cluster}/projects`)
        return [
            {
                key: 'deployChainCode',
                icon: 'pen',
                text: t('deployChainCode'),
                action: 'manage',
                show: this.showAction,
                onClick: item =>{
                    if(channelList){
                        trigger('chainCode.deploy', {
                            detail: { item, namespace, channelList, username },
                            success: routing.history.push(`/clusters/${cluster}/projects/${namespace}/chainCode`),
                        })}
                    }
            },
            {
                key: 'chainCodeManagement',
                icon: 'network-router',
                text: t('memberManagement'),
                action: 'manage',
                show: this.showAction,
                onClick: item =>
                    trigger('resource.baseinfo.edit', {
                        detail: omit(item, 'workspace'),
                        success: routing.query,
                    }),
            },
            {
                key: 'deleteChainCode',
                icon: 'trash',
                text: t('deleteChainCode'),
                action: 'delete',
                show: record => !record.workspace && this.showAction(record),
                onClick: item =>
                    trigger('chainCode.delete', {
                        detail: item,
                        success: routing.query,
                    }),
            },
        ]
    }
    // 表单操作 onFetch监控点击的是左箭头或右箭头
    get tableActions() {
        const { tableProps } = this.props
        return {
          ...tableProps.tableActions,
          onFetch: this.handleFetch,
        }
      }

    renderStatus (status){
        console.log(status);
        if(status === 3){
            let status_now = 'Active'
            console.log(status_now);
            return <Status type={status_now} name={t(status_now)} flicker />
        }
    }
    // 换页处理请求
    handleFetch = (params, refresh) => {
        const { page } = params
        const { limit } = this.state.pagination
        this.setState({
          pagination: {
            page: page,
            limit: limit
          }
        })
      }
    getTableProps() {
        const { tableProps } = this.props
    }

    getColumns = (record) => {
        //getColumns 的数据来自于 record，表面上并没有任何地方传入了 record (Test已经是根组件没有调用他的组件了)
        //record由浏览器打印可以看到是一条完整的table数据
        // console.log("表格当前记录",record)
        const { getSortOrder, prefix } = this.props
        return [

            {
                title: t('chaincodeId'),
                dataIndex: 'metadata.uid',
                isHideable: true,
                width: '20%',
            },
            {
                title: t('chaincodeName'),
                dataIndex: 'metadata.name',
                isHideable: true,
                width: '12%',
            },
            {
                title: t('chaincodeLanguage'),
                dataIndex: 'spec.chaincodeLanguage',
                isHideable: true,
                width: '10%',
            },
            {
                title: t('chaincodeVersion'),
                dataIndex: 'spec.chaincodeVersion',
                isHideable: true,
                width: '10%',
            },
            {
                title: t('createUser'),
                dataIndex: 'spec.deployUser',
                isHideable: true,
                width: '10%',
            },
            {
                title: t('chaincodeOrganizationName'),
                dataIndex: 'spec.deployOrganizationName',
                isHideable: true,
                width: '10%',
            },
            {
                title: t('chaincodeState'),
                dataIndex: 'spec.state',
                isHideable: true,
                width: '10%',
                // render: status => this.renderStatus(status)
                render: status => <Status type={'Running'} name={t('Running')} flicker />
            },
            {
                title: t('creationTime'),
                dataIndex: 'metadata.creationTimestamp',
                isHideable: true,
                width: '10%',
                render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),

            },

        ]
    }
    render() {
        const { tableProps } = this.props;
        const items = toJS(this.monitoringStore.deployChainCodeList.result)
        if (items) {
            const { page,limit } = this.state.pagination
            // console.log(page);
            // console.log(items);
            // post请求会导致items变为请求后的返回结果 这里跳过不执行
            if (!items.items) {
                console.log("++++++++++++items不存在");
            } else {
                tableProps.data = items.items.slice((page - 1) * limit, page * limit)
                tableProps.pagination.total = items.totalItems
                tableProps.pagination.limit = limit
                tableProps.pagination.page = page
                // console.log("tableProps信息", tableProps)
            }

        }
        return (
            <div>
                <MyPanel title={t('ChainCodeManagement')} className={styles.content} extras={'ChainCode'} getMsg={this.getChildMsg}>
                    <ListPage {...this.props} getData={this.getData} >
                        <Table
                            {...tableProps}
                            itemActions={this.itemActions}
                            tableActions={this.tableActions}
                            columns={this.getColumns()}
                            searchType="chaincodeName"
                            hideHeader
                        />
                    </ListPage>
                </MyPanel>
            </div>
        );

    }
}

export default ChainCode;