/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import { action, observable } from 'mobx'
import { get } from 'lodash'

import { to } from 'utils'
// import axios from 'axios'
import Base from './base'

export default class ClusterMonitoring extends Base {
  @observable
  statistics = {
    data: {},
    isLoading: false,
  }

  @observable
  nodeInfo = {
    data: {},
    isLoading: false,
  }

  @observable
  allianceList = {
    data: {},
    isLoading: false,
  }
  @observable
  chainCodeList = {
    data: {},
    isLoading: false,
  }
  
  @observable
  deployChainCodeList = {
    data: {},
    isLoading: false,
  }

  @observable
  orgList = {
    data: {},
    isLoading: false,
  }

  @observable
  channelList = {
    data: {},
    isLoading: false,
  }

  @observable
  resourceMetrics = {
    originData: {},
    data: [],
    isLoading: false,
  }

  @action
  async fetchStatistics() {
    this.statistics.isLoading = true

    const params = {
      type: 'statistics',
    }
    const result = await to(request.get(this.getApi(), params))
    const data = this.getResult(result)

    this.statistics = {
      data,
      isLoading: false,
    }

    return data
  }

  @action
  async fetchApplicationResourceMetrics({
    workspace,
    namespace,
    autoRefresh = false,
    ...filters
  }) {
    if (autoRefresh) {
      filters.last = true
      this.resourceMetrics.isRefreshing = true
    } else {
      this.resourceMetrics.isLoading = true
    }

    if (filters.cluster) {
      this.cluster = filters.cluster
    }

    const params = this.getParams(filters)

    // set correct path
    const paramsReg = /^[a-zA-Z]+_/g
    const metricType = get(filters.metrics, '[0]', '').replace(
      paramsReg,
      'cluster_'
    )
    let path = 'cluster'

    if (workspace) {
      path = `workspaces/${workspace}`
      params.metrics_filter = `${metricType.replace(paramsReg, 'workspace_')}$`
    }
    if (namespace && namespace !== 'all') {
      path = `namespaces/${namespace}`
      params.metrics_filter = `${metricType.replace(paramsReg, 'namespace_')}$`
    }

    const result = await to(request.get(`${this.apiVersion}/${path}`, params))

    let data = this.getResult(result)
    if (autoRefresh) {
      data = this.getRefreshResult(data, this.resourceMetrics.originData)
    }

    this.resourceMetrics = {
      originData: data,
      data: get(Object.values(data), '[0].data.result') || [],
      isLoading: false,
      isRefreshing: false,
    }

    return data
  }

  fetchClusterDevopsCount = async () => {
    const result = await request.get(
      'kapis/tenant.kubesphere.io/v1alpha2/devopscount/'
    )

    return get(result, 'count', 0)
  }


  // ???????????????????????????
  joinChannel = async ({
    data,namespace
  }) => {
    const { organizationName,
      channelName } = data
    const result = await to(request.get('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/OrgPeersJoinChannel?nameSpaceName='
    +namespace+"&channelName="+channelName+"&orgName="+organizationName))
    // console.log("ok");
    return result
  }
  // ?????????????????????
  orgJoinChannel = async ({
                         data,namespace
                       }) => {
    console.log("?????????????????????data",data)
    const { orgName,
      channelName } = data
    const result = await to(request.get('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/NewOrgJoinChannel?nameSpaceName='
      +namespace+"&channelName="+channelName+"&orgName="+orgName))
    console.log("result?????????",result)
    console.log("??????");
    return result
  }

  // ????????????
  @action
  async createOrganization({
    params
  } = {}) {
    this.orgList.isLoading = true
    const result = await to(request.post('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/addOrgWithPeers', params))
    this.orgList = {
      result,
      isLoading: false,
    }
    return result
  }

  // ??????????????????
  updateOrganization = async ({
    data
  }) => {
    console.log(data.item);
    const { metadata, spec } = data.item
    const params = {
      "kind": "org",
      "apiVersion": "orgcontroller.kubesphere.io/v1alpha1",
      "metadata": {
        "name": metadata.name,
        "namespace": metadata.namespace,
        "creationTimestamp": null,
        "resourceVersion": metadata.resourceVersion
      },
      "spec": {
        "name": spec.name,
        "id": spec.id,
        "descriptions": spec.descriptions,
        "tenant_id": spec.tenant_id,
        "status": spec.status
      }
    }
    console.log(params);
    // console.log(name,namespace,apiVersion,consortiumName);
    const result = await to(request.put('/kapis/orgcontroller.kubesphere.io/v1alpha1/orgs/' + metadata.name, params))
    console.log("update ok");
    return result
  }

  // ????????????
  deleteOrganization = async ({
    detail
  }) => {
    // console.log(detail);
    const { name, namespace } = detail.item.metadata
    const { apiVersion } = detail.item
    const { consortiumName } = detail
    // console.log(name,namespace,apiVersion,consortiumName);
    const result = await to(request.delete('kapis/' + apiVersion + '/orgs/' + name + '/' + consortiumName + '/' + namespace))
    // console.log("delete ok",result);
    return result
  }

  // ??????????????????
  @action
  async getChannelList({
    params
  }) {
    this.channelList.isLoading = true
    const result = await to(request.post('kapis/consortiumcontroller.kubesphere.io/v1alpha1/getChannelsInfo', params))
    // console.log(params, "?????????????????????????????????")
    this.channelList = {
      result,
      isLoading: false,
    }
    // console.log(result, '????????????????????????')
    return result

  }

  // ????????????
  @action
  async createChannel({
    params
  }) {
    console.log(params);
    this.channelList.isLoading = true
    const result = await to(request.get('kapis/consortiumcontroller.kubesphere.io/v1alpha1/CreateChannel', params))
    this.channelList = {
      isLoading: false,
    }
    console.log("??????????????????????????????", result)
    return result
  }

  // ????????????
  @action
  async uploadChainCode({
    formData
  }) {
    const result = await to(request.post('/kapis/fabric.kubesphere.io/v1alpha1/chaincodetemplates/upload', formData))
    // const result = axios.post('/kapis/fabric.kubesphere.io/v1alpha1/chaincodetemplates/upload', formData)
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    return result
  }

  // ????????????
  @action
  async getchaincode({
    params
  }) {
    const { namespace } = params
    this.chainCodeList.isLoading = true
    const result = await to(request.get('kapis/fabric.kubesphere.io/v1alpha1/chaincodetemplates/' + namespace))
    this.chainCodeList = {
      result,
      isLoading: false,
    }
    return result
  }

  // ????????????
  @action
  async deployChainCode({
    data, namespace, item, username
  }) {
    const { channelName, organizationName, peerName, chainCodeVersion } = data
    const chain_name = JSON.parse(localStorage.getItem('chain_name'));
    const { apiVersion, kind, metadata, spec } = item
    const chaincodeCrdName = chain_name + '.' + channelName + '.' + metadata.name
    const params = {
      "key": spec.key,
      "namespace": namespace,
      "channelName": channelName,
      "orgName": organizationName,
      "chaincode": {
        "kind": kind,
        "apiVersion": apiVersion,
        "metadata": {
          "name": chaincodeCrdName,
          "namespace": namespace,
          "creationTimestamp": null
        },
        "spec": {
          "chaincodeName": spec.chaincodeName,
          "chaincodeVersion": chainCodeVersion,
          "chaincodeLanguage": spec.chaincodeLanguage,
          "consortiumName": chain_name,
          "deployOrganizationName": organizationName,
          "channelName": channelName,
          "deployPeerName": peerName.join(','),
          "endorsementStrategy": organizationName,
          "deployUser": username,
          "state": 2
        }
      }
    }
    this.chainCodeList.isLoading = true
    const result = await to(request.post('/kapis/fabric.kubesphere.io/v1alpha1/chaincodes/deploy', params))
    this.chainCodeList = {
      isLoading: false,
    }
    console.log('ok', result);
    return result
  }

  // ????????????
  @action
  async deleteChainCode({
    detail
  }) {
    const { name, namespace } = detail.metadata
    this.chainCodeList.isLoading = true
    const result = await to(request.delete('/kapis/fabric.kubesphere.io/v1alpha1/chaincodetemplates/' + namespace + '/' + name))
    this.chainCodeList = {
      isLoading: false,
    }
    console.log("ok");
    return result
  }

  // ????????????????????????
  @action
  async getDeployChainCode({
    params
  }) {
    const { namespace } = params
    this.deployChainCodeList.isLoading = true
    const result = await to(request.get('/kapis/fabric.kubesphere.io/v1alpha1/chaincodes/' + namespace))
    this.deployChainCodeList = {
      result,
      isLoading: false,
    }
    return result
  }
  // ????????????
  @action
  async deleteAlliance({
    namespace
  } = {}) {
    this.statistics.isLoading = true
    // console.log(namespace, '=========>>>>>>>>')
    const result = await to(request.get('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/deleteFabric?nameSpaceName=' + namespace))
    this.statistics = {
      result,
      isLoading: false,
    }
    console.log("ok");
    return result
  }

  // ??????????????????
  @action
  async getAlliance({
    params
  } = {}) {
    this.allianceList.isLoading = true
    const { chainName, nameSpaceName } = params
    // console.log(getAlliance, '=========>>>>>>>>')
    const result = await to(request.get('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/getChainInfo?nameSpaceName=' + nameSpaceName + '&chainName=' + chainName))
    this.allianceList = {
      result,
      isLoading: false,
    }
    // console.log("?????????????????? this.allianceList", this.allianceList)
    // console.log("ok",result);
    return result
  }

  // ????????????????????????
  @action
  async getServiceData({
    getServiceData
  } = {}) {
    this.nodeInfo.isLoading = true
    // console.log(getServiceData, '=========>>>>>>>>')
    const result = await to(request.post('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/getNodesInfo', getServiceData))
    this.nodeInfo = {
      result,
      isLoading: false,
    }
    // console.log("?????????????????? this.nodeInfo", this.nodeInfo)
    // console.log("ok");
    return result
  }

  // ??????????????????
  @action
  async fetchOrganizationList({
    params
  } = {}) {
    this.orgList.isLoading = true
    // console.log(getAlliance, '=========>>>>>>>>')
    const result = await to(request.post('/kapis/consortiumcontroller.kubesphere.io/v1alpha1/getOrgsInfo', params))
    this.orgList = {
      result,
      isLoading: false,
    }
    return result
  }
}