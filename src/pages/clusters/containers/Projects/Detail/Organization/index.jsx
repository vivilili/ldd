import React from 'react'
import {
  Pagination, Tooltip,
} from '@kube-design/components'
import { Status } from 'components/Base'
import { MyPanel } from 'components/Base'
import { toJS } from 'mobx'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import styles from './index.scss'
import clusterStore from "stores/monitoring/cluster"
import { getLocalTime } from 'utils'
import { get, omit } from 'lodash'
@withList({
  store: new clusterStore(),
  name: 'Organization',
  module: 'organization',
})
class Organization extends React.Component {
  state = {
    msg: {
      new_org_name: '',
      organizationDescriptions: '',
      new_org_peer_ports: '',
    },
    pagination: {
      page: 1,
    }
  }

  componentDidMount() {
    this.getChannelList({})
  }
  getData = async () => {
    const { page } = this.state.pagination
    const { namespace } = this.props.match.params
    const params = {
      "namespace": namespace,
      "per_page_count": 4,
      "current_page": page
    }
    await this.monitoringStore.fetchOrganizationList({
      params
    })

    // const params2 = {
    //   "namespace": namespace,
    //   "per_page_count": -1,
    //   "current_page": 1
    // }
    // await this.monitoringStore.getChannelList({
    //   params2
    // })
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


  monitoringStore = new clusterStore()
  showAction = record => !record.isFedManaged

  get itemActions() {
    const { trigger, routing, name } = this.props
    const { namespace, cluster } = this.props.match.params
    const channelList = toJS(this.monitoringStore.channelList.result)
    const orgList = toJS(this.monitoringStore.orgList.result)
    // console.log("获取的通道列表", channelList)
    // console.log("获取的组织列表",orgList)
    var chain_name = JSON.parse(localStorage.getItem('chain_name'));
    // const { consortiumName } = this.state.msg
    return [
      {
        key: 'orgMemberManagement',
        icon: 'network-router',
        text: t('orgMemberManagement'),
        action: 'manage',
        show: record => !record.workspace && this.showAction(record),
        onClick: item =>
          trigger('org.join', {
            detail: { item, namespace, chain_name, channelList },
            success: routing.query,
          }),
      },
    ]
  }


  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onFetch: this.handleFetch,
    }
  }
  // 邀请组织
  createOrganization = async () => {
    const { new_org_name, organizationDescriptions, new_org_peer_ports } = this.state.msg
    const { namespace } = this.props.match.params
    // console.log(new_org_peer_ports.split(',').map(Number));
    const params = {
      "namespace": namespace,
      "new_org_name": new_org_name,
      "new_org_peer_ports": new_org_peer_ports.split(',').map(Number),
      "description": organizationDescriptions
    }
    // console.log(params);
    await this.monitoringStore.createOrganization({
      params
    })
    this.getData()
  }
  getTableProps() {
    const { tableProps } = this.props
  }

  getChildMsg = (msg) => {
    // console.log(msg);
    this.setState({
      msg
    }, () => this.createOrganization())
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



  renderTaintsTip = data => (
    <div>
      {data.map(item => {
        return <div>{item}</div>
      })}
    </div>
  )

  getColumns = () => {
    const { getSortOrder, prefix } = this.props
    return [
      {
        title: t('organizationName'),
        key: 'name',
        dataIndex: 'name',
        isHideable: true,
        width: '18%',
        // render: this.renderStatus,
      },
      {
        title: t('organizationDescriptions'),
        dataIndex: 'descriptions',
        isHideable: true,
        width: '18%',
        // render: this.renderStatus,
      },
      {
        title: t('init_org'),
        dataIndex: 'init_org',
        isHideable: true,
        width: '18%',
        render: initOrg => {
          if (initOrg) {
            return '是'
          } else {
            return '否'
          }
        }
      },
      {
        title: t('joinChannels'),
        dataIndex: 'channels',
        isHideable: true,
        width: '18%',
        render: channels => {
          return (
            <Tooltip content={this.renderTaintsTip(channels)}>
              <span className={styles.taints}>{channels.length}</span>
            </Tooltip>
          )
        }
        // render: channels => {
        //   if (channels.length) {
        //     return channels
        //   } else {
        //     return 0
        //   }
        // },
      },


      {
        title: t('orgPeers'),
        dataIndex: 'peers',
        isHideable: true,
        width: '18%',
        render: peers => peers.length
      },
    ]
  }

  render() {
    const { tableProps } = this.props;
    const orgInfo = toJS(this.monitoringStore.orgList.result)
    if (orgInfo) {
      const { page } = this.state.pagination
      tableProps.data = orgInfo.orgs_info
      tableProps.pagination.total = orgInfo.total_page
      tableProps.pagination.limit = orgInfo.per_page_count
      tableProps.pagination.page = page
      // console.log("tableProps信息", tableProps)
    }

    return (
      <MyPanel title={t('OrganizationManagement')} className={styles.content} extras={'Organization'} getMsg={this.getChildMsg}>
        <ListPage {...this.props} getData={this.getData} >
          <Table
            {...tableProps}
            itemActions={this.itemActions}
            tableActions={this.tableActions}
            columns={this.getColumns()}
            searchType="name"
            hideHeader
          />
        </ListPage>
      </MyPanel>
    );
  }
}

export default Organization;