import React from 'react'
import {
    Pagination,
    Select,
    Text,
    Strong,
    Tooltip
} from '@kube-design/components'
import { MyPanel } from 'components/Base'
import styles from './index.scss'
import { toJS } from 'mobx'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import clusterStore from "stores/monitoring/cluster"

import { getLocalTime } from 'utils'

@withList({
    store: new clusterStore(),
    name: 'Channel',
    module: 'Channel',
})
class Channel extends React.Component {
    state = {
        msg: {
            filename: '',
            channelDescription: ''
        },
        pagination: {
            page: 1,
        }
    }
    monitoringStore = new clusterStore()

    showAction = record => !record.isFedManaged

    getChildMsg = (msg) => {
        // console.log(msg);
        this.setState({
            msg
        }, () => this.createChannel())
    }

    getData = async ({ }) => {  //获取接口
        const { page } = this.state.pagination
        const { namespace } = this.props.match.params
        const params = {
            "namespace": namespace,
            "per_page_count": 4,
            "current_page": page
        }
        await this.monitoringStore.getChannelList({
            params
        })
    }

    get itemActions() {
        const { trigger, routing, name } = this.props
        const { namespace, cluster } = this.props.match.params
        const channelList = toJS(this.monitoringStore.channelList.result)
        var chain_name = JSON.parse(localStorage.getItem('chain_name'));
        return [
            // {
            //     key: 'memberManagement',
            //     icon: 'network-router',
            //     text: t('memberManagement'),
            //     action: 'manage',
            //     show: record => !record.workspace && this.showAction(record),
            //     onClick: item =>
            //         trigger('resource.baseinfo.edit', {
            //             detail: omit(item, 'workspace'),
            //             success: routing.query,
            //         }),
            // },
            {
                key: 'memberManagement',
                icon: 'network-router',
                text: t('memberManagement'),
                action: 'manage',
                show: record => !record.workspace && this.showAction(record),
                onClick: item =>
                    trigger('channel.join', {
                        detail: { item, namespace, chain_name, channelList },
                        success: routing.query,
                    }),
            },
            // {
            //     key: 'chainCodeManagement',
            //     icon: 'ip',
            //     text: t('chainCodeManagement'),
            //     action: 'manage',
            //     show: record => !record.workspace && this.showAction(record),
            //     onClick: item =>
            //         trigger('project.assignworkspace', {
            //             detail: item,
            //             success: routing.query,
            //         }),
            // },
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
        const { routing } = this.props
        this.setState({
            pagination: {
                page: page,
            }
        }, () => {
            routing.query({ ...params }, refresh)
        })
    }

    createChannel = async () => {
        const { channelName, channelDescription } = this.state.msg
        const { page } = this.state.pagination
        const { namespace } = this.props.match.params
        const params = {
            "nameSpaceName": namespace,
            "description": channelDescription,
            "channelName": channelName,
        }
        await this.monitoringStore.createChannel({
            params
        })
        this.getData({});
    }


    getTableProps() {
        const { tableProps } = this.props
    }
    renderTaintsTip = data => (
        <div>
            {data.map(item => {
                return <div>{item}</div>
            })}
        </div>
    )

    //表头
    getColumns = (record) => {
        return [

            {
                title: t('channel_name'),
                dataIndex: 'channel_name',
                // sorter: true,
                // sortOrder: getSortOrder('name'),
                isHideable: true,
                width: '20%',
                // render: this.renderStatus,
            },
            {
                title: t('description'),
                dataIndex: 'description',
                isHideable: true,
                width: '20%',
                // render: this.renderStatus,
            },
            {
                title: t('initOrg'),
                dataIndex: 'init_org',
                isHideable: true,
                width: '20%',
                // render: this.renderStatus,
            },
            {
                title: t('orgExit'),
                dataIndex: 'orgs_exit',
                isHideable: true,
                width: '20%',
                // render: this.renderOrg(orgs_exit)
            },
            {
                title: t('orgExitPeers'),
                dataIndex: 'peers',
                isHideable: true,
                width: '20%',
                render: peers => {
                    return (
                        <Tooltip content={this.renderTaintsTip(peers)}>
                            <span className={styles.taints}>{peers.length}</span>
                        </Tooltip>
                    )
                }
            },

            /* {
                title: t('organization_id'),
                dataIndex: 'spec.organization_id',
                isHideable: true,
                width: '20%',
                // render: this.renderStatus,
            },
            {
                title: t('channel_jointime'),
                dataIndex: 'metadata.creationTimestamp',
                isHideable: true,
                width: '20%',
                render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
                // render: this.renderStatus,
            }, */
        ]
    }
    render() {
        const { tableProps } = this.props;
        const channelList = toJS(this.monitoringStore.channelList.result)
        const { page } = this.state.pagination
        if (channelList) {
            // console.log(channelList);
            tableProps.data = channelList.channels_info
            tableProps.pagination.total = channelList.totals
            tableProps.pagination.limit = channelList.per_page_count
            tableProps.pagination.page = page
            // console.log("tableProps信息", tableProps)
        }
        return (
            <div>
                <MyPanel title={t('ChannelManagement')} className={styles.content} extras={'Channel'} getMsg={this.getChildMsg}>
                    <ListPage {...this.props} getData={this.getData} >
                        <Table
                            {...tableProps}
                            itemActions={this.itemActions}
                            tableActions={this.tableActions}
                            columns={this.getColumns()}
                            searchType="channel_name"
                            hideHeader
                        />
                    </ListPage>
                </MyPanel>
            </div>
        );

    }
}

export default Channel;
