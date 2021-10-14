//链码仓库
import React from 'react'
import { MyPanel } from 'components/Base'
import styles from './index.scss'
//1 引入store
import clusterStore from "stores/monitoring/cluster"
import { toJS } from "mobx";
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
//2 定义数据结构
@withList({
    store: new clusterStore(),
    name: 'ChainCodeDepository',
    module: 'ChainCodeDepository',
})
class ChainCodeDepository extends React.Component {
    //3 新建了cluserStore类的对象monitoringStore
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
    componentDidMount() {
        this.getChannelList({})
    }
    fetchList(page) {
        this.setState({
            pagination: {
                page: page,
            }
        })
    }
    //b 使用回调函数 用于给子组件传值 并在获取到传参后调用uploadChaincode去调用接口
    getChildMsg = (msg) => {
        // console.log(msg);
        this.setState({
            msg
        }, () => this.uploadChainCode())
    }
    //4 使用getData获取数据
    getData = async ({ }) => {  //获取接口
        //5 在cluster.js中写调用接口的api
        const { namespace } = this.props.match.params
        const params = {
            namespace: namespace,
        }
        await this.monitoringStore.getchaincode({
            params
        })
    }
    //c 用户调用上传链码的接口函数
    uploadChainCode = async () => {
        const { chainCodeLanguage, description, chainCodeFile } = this.state.msg
        const { namespace, cluster } = this.props.match.params
        let formData = new FormData()
        let filename = chainCodeFile.name.split('.')[0]
        formData.append("key", "chaincode/" + filename)
        formData.append("filename", filename)
        formData.append("namespace", namespace)
        formData.append("chaincodeLanguage", chainCodeLanguage)
        formData.append("organizationName", "firstorg")
        formData.append("uploadUser", globals.user.username)
        formData.append("description", description)
        formData.append("upload", chainCodeFile)

        await this.monitoringStore.uploadChainCode({
            formData
        })
        this.getData({})
    }
    //获取通道列表
    getChannelList = async ({ }) => {
        const { namespace } = this.props.match.params
        const params = {
            "namespace": namespace,
            "per_page_count": -1,
            "current_page": 1
        }
        await this.monitoringStore.getChannelList({
            params
        })
    }
    get itemActions() {
        const { trigger, routing } = this.props
        const { namespace, cluster } = this.props.match.params
        const { username } = globals.user
        const channelList = toJS(this.monitoringStore.channelList.result)
        console.log(channelList);
        // this.props.history.push(`/clusters/${cluster}/projects`)
        return [
            {
                key: 'deployChainCode',
                icon: 'pen',
                text: t('deployChainCode'),
                action: 'manage',
                show: this.showAction,
                onClick: item => {
                    if (channelList) {
                        trigger('chainCode.deploy', {
                            detail: { item, namespace, channelList, username },
                            success: routing.history.push(`/clusters/${cluster}/projects/${namespace}/chainCode`),
                        })
                    }
                }
            },
            // {
            //     key: 'chainCodeManagement',
            //     icon: 'network-router',
            //     text: t('memberManagement'),
            //     action: 'manage',
            //     show: this.showAction,
            //     onClick: item =>
            //         trigger('resource.baseinfo.edit', {
            //             detail: omit(item, 'workspace'),
            //             success: routing.query,
            //         }),
            // },
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
    //6 定义获取数据表头
    getColumns = (record) => {
        //getColumns 的数据来自于 record，表面上并没有任何地方传入了 record (Test已经是根组件没有调用他的组件了)
        //record由浏览器打印可以看到是一条完整的table数据
        // console.log("表格当前记录",record)
        const { getSortOrder, prefix } = this.props
        return [

            {
                title: t('chaincodeId'),
                dataIndex: 'metadata.uid',
                // sorter: true,
                // sortOrder: getSortOrder('name'),
                isHideable: true,
                width: '20%',
                // render: this.renderStatus,
            },
            {
                title: t('chaincodeName'),
                dataIndex: 'spec.chaincodeName',
                isHideable: true,
                width: '15%',
                // render: this.renderStatus,
            },
            {
                title: t('chaincodeLanguage'),
                dataIndex: 'spec.chaincodeLanguage',
                isHideable: true,
                width: '15%',
                // render: this.renderStatus,
            },
            {
                title: t('createUser'),
                dataIndex: 'spec.createUser',
                isHideable: true,
                width: '15%',
                // render: this.renderStatus,
            },
            {
                title: t('chaincodeOrganizationName'),
                dataIndex: 'spec.organizationName',
                isHideable: true,
                width: '15%',
            },
            {
                title: t('chaincodeDescription'),
                dataIndex: 'spec.description',
                isHideable: true,
                width: '15%',
            },

        ]
    }
    render() {
        // console.log(globals);
        //7 获取tableProps 用于传递数据
        //真正的数据传入是tableProps
        const { tableProps } = this.props;
        const items = toJS(this.monitoringStore.chainCodeList.result)
        if (items) {
            const { page, limit } = this.state.pagination
            // console.log(page);
            // post请求会导致items变为请求后的返回结果 这里跳过不执行
            if (!items.items) {
                // console.log("++++++++++++items不存在");
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
                {/* 将回调函数以props的方式传给子组件*/}
                <MyPanel title={t('ChainCodeDepository')} className={styles.content} extras={'ChainCodeDepository'} getMsg={this.getChildMsg}>
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
export default ChainCodeDepository;