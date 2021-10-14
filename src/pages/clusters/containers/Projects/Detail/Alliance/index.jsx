
import React from 'react'
import {
  Menu,
  Tooltip
} from '@kube-design/components'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { toJS } from 'mobx'
import { MyPanel } from 'components/Base'
import clusterStore from "stores/monitoring/cluster"
import styles from './index.scss'
import { element } from 'prop-types'

@withList({
  store: new clusterStore(),
  name: 'Alliance',
  module: 'Alliance',
})
class Alliance extends React.Component {
  state = {
    msg: {
      deleteAlliance: false
    },
    pagination: {
      page: 1,
    },

  }
  monitoringStore = new clusterStore()
  get itemActions2() {
    const { trigger, routing, name } = this.props
    return [
      {
        key: 'memberManagement',
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
        key: 'chainCodeManagement',
        icon: 'ip',
        text: t('chainCodeManagement'),
        action: 'manage',
        show: record => !record.workspace && this.showAction(record),
        onClick: item =>
          trigger('project.assignworkspace', {
            detail: item,
            success: routing.query,
          }),
      },
    ]
  }
  // 表单操作
  get tableActions2() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onFetch: this.handleFetch,
    }
  }
  renderTaintsTip = data => (
    <div>
        {data.map(item => {
            return <div>{item}</div>
        })}
    </div>
)
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

  mySelect = (channels) => {
    const options = [];
    var counts = channels.length;
    var i;
    for (i = 0; i < counts; i++) {
      options[i] = {
        value: channels[i],
        label: channels[i]
      }
    }
    return options
  }

  myMenu = (channels) => {
    return <>
      <Menu>
        {
          channels.forEach(element, index => {
            <Menu.MenuItem key={index}>
              {element}
            </Menu.MenuItem>
          })
        }
      </Menu>
      {/* <Button>channel</Button> */}
    </>
  }
  //表头
  getColumns = (record) => {
    // console.log("表格当前记录",record)

    const { getSortOrder, prefix } = this.props
    return [
      {
        title: t('consortium_name_display'),
        key: 'consortium_name_display',
        dataIndex: 'consortium_name_display',
        // sorter: true,
        // sortOrder: getSortOrder('name'),
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('consortium_framework'),
        dataIndex: 'consortium_framework',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('consensus'),
        dataIndex: 'consensus',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('cluster_info'),
        dataIndex: 'cluster_info',
        isHideable: true,
        width: '12.5%',
        // render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
        // render: this.renderStatus,
      },
      {
        title: t('node_num'),
        dataIndex: 'node_num',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('channel_num'),
        dataIndex: 'channel_num',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('org_num'),
        dataIndex: 'org_num',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },
      {
        title: t('consortium_description'),
        dataIndex: 'consortium_description',
        isHideable: true,
        width: '12.5%',
        // render: this.renderStatus,
      },

    ]
  }

  getColumns2 = (record) => {
    return [
      {
        title: t('node_name'),
        key: 'node_name',
        dataIndex: 'node_name',
        // sorter: true,
        // sortOrder: getSortOrder('name'),
        isHideable: true,
        width: '15%',
        // render: this.renderStatus,
      },
      {
        title: t('node_type'),
        dataIndex: 'node_type',
        isHideable: true,
        width: '15%',
        render: (type) => {
          if (type === 0) {
            return 'order'
          } else {
            return 'peer'
          }
        },
      },
      {
        title: t('node_ip'),
        dataIndex: 'node_ip',
        isHideable: true,
        width: '15%',
        // render: this.renderStatus,
      },
      {
        title: t('node_port'),
        dataIndex: 'node_port',
        isHideable: true,
        width: '15%',
        // render: this.renderStatus,
      },
      {
        title: t('node_description'),
        dataIndex: 'node_description',
        isHideable: true,
        width: '15%',
        // render: this.renderStatus,
      },
      {
        title: t('joinChannels'),
        dataIndex: 'channels',
        isHideable: true,
        width: '15%',
        render: peers => {
          return (
              <Tooltip content={this.renderTaintsTip(peers)}>
                  <span className={styles.taints}>{peers.length}</span>
              </Tooltip>
          )
      }
      },
    ]
  }
  // <Select className={styles.mySelect} options={this.mySelect(channels)} defaultValue="channel" />
  showAction = record => !record.isFedManaged
  getChildMsg = (msg) => {
    // console.log(msg);
    this.setState({
      msg
    }, () => this.deleteAlliance())
  }
  //获取联盟信息
  getData = async ({ }) => {
    const { namespace } = this.props.match.params
    const chain_name = JSON.parse(localStorage.getItem("chain_name")); 
    const params = {
      nameSpaceName: namespace,
      chainName: chain_name
    }
    await this.monitoringStore.getAlliance({
      params
    })
  }
  // 获取节点服务信息
  getServiceData = async () => {
    const { page } = this.state.pagination
    const { namespace } = this.props.match.params
    const getServiceData = {
      "namespace": namespace,
      "per_page_count": 6,
      "current_page": page
    }
    // console.log("getServiceData", getServiceData);
    await this.monitoringStore.getServiceData({
      getServiceData
    })
  }
  // 删除联盟
  deleteAlliance = async () => {
    const { deleteAlliance } = this.state.msg
    const { cluster } = this.props.match.params
    if (deleteAlliance === true) {
      const { namespace, cluster } = this.props.match.params
      await this.monitoringStore.deleteAlliance({
        namespace
      })
      this.props.history.push(`/clusters/${cluster}/projects`)
    }
  }

  render() {
    const { tableProps } = this.props;
    const tableProps2 = { ...tableProps }
    //真正的数据传入是tableProps
    const items = toJS(this.monitoringStore.allianceList.result)
    const nodeInfo = toJS(this.monitoringStore.nodeInfo.result)
    if (items) {
      // console.log(items, '====================================')
      tableProps.data = [items]
      tableProps.keyword = items.consortium_name_display
      // console.log("tableProps信息", tableProps)
    }
    if (nodeInfo) {
      // console.log(nodeInfo, '====================================')
      tableProps2.data = nodeInfo.nodes_info
      tableProps2.pagination.total = nodeInfo.totals
      tableProps2.pagination.page = nodeInfo.current_page
      tableProps2.pagination.limit = nodeInfo.per_page_count
      // console.log("tableProps2信息", tableProps2)
    }
    return (
      <div>
        <MyPanel title={t('AllianceMent')} className={styles.content} extras={'Alliance'} getMsg={this.getChildMsg}>
          <div className={styles.title}>＞ 基本信息</div>
          <ListPage {...this.props} getData={this.getData} >
            <Table
              {...tableProps}
              itemActions={this.itemActions}
              tableActions={this.tableActions}
              columns={this.getColumns()}
              hideFooter
              hideHeader
            // searchType="consortium_name_display"
            />
          </ListPage>

          <div className={styles.title} >＞ 服务监控</div>
          <ListPage {...this.props} getData={this.getServiceData} >
            <Table
              {...tableProps2}
              itemActions={this.itemActions2}
              tableActions={this.tableActions2}
              columns={this.getColumns2()}
              searchType="node_name"
              hideHeader
            />
          </ListPage>
        </MyPanel>
      </div >
    );
  }
}

export default Alliance;