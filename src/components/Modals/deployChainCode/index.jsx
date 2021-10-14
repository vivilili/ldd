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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import {Alert, Form, Input, Select} from '@kube-design/components'
import { Modal } from 'components/Base'
import WorkspaceStore from 'stores/workspace'
import UserStore from 'stores/user'
import styles from './index.scss'
// @withList({
//   store: new clusterStore(),
//   name: 'Organization',
//   module: 'organization',
// })
export default class deployChainCodeModel extends Component {
  state = {
    pagination:{
      page:1,
    },
    channelName: '',
    orgExit: [],
    deployPeerName: [],

  }
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }


  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      workspace: '',
    }
    this.formTemplate = {}
    this.workspaceStore = new WorkspaceStore()
    this.memberStore = new UserStore()
  }
  //获取下拉框的数据
  getWorkspaces() {
    const {channels_info} = this.props.detail.channelList
    return channels_info.map(item => ({
      label: item.channel_name,
      value: item.channel_name
    }))
  }

  getOrgOptions(){
    const {orgExit} = this.state
    if(orgExit){
      // console.log(orgExit);
      return orgExit.map(item => ({
        label: item,
        value: item
      }))
    }
  }
  getPeerOptions(){
    const {deployPeerName} = this.state
    if(deployPeerName){
      return deployPeerName.map(item => ({
        label: item,
        value: item
      }))
    }
  }
  getChannelName(){
    const {channelName} = this.state
    if(channelName){
      return channelName
    }

  }
  renderOrgExit (channel_name) {
    const {channels_info} = this.props.detail.channelList
    for (const item of channels_info){
      if(item.channel_name === channel_name){
        this.setState({
          channelName: channel_name,
          orgExit: item.orgs_exit,
          deployPeerName: item.peers
        })
      }
    }
  }


  render() {
    const {
      visible,
      formTemplate,
      hideCluster,
      onOk,
      onCancel,
      isSubmitting,
    } = this.props
    return (
      <Modal.Form
        title={t('deployChainCode')}
        icon="firewall"
        width={497}
        data={formTemplate}
        {...this.props}
        onOk={onOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Alert
          className="margin-b12"
          type="info"
          message={t('该操作是将链码部署到所选择的通道')}
        />
        <Form.Item label={t('选择通道')} desc={t('Choose a channel')}>
          <Select
            name = "channelName" 
            // value={this.getChannelName()}
            // onChange={this.renderOrgExit.bind(this)}
            onChange={(e)=>this.renderOrgExit(e)}
            options={this.getWorkspaces()}
          />
        </Form.Item>
        <Form.Item
          label={t('选择组织')}
          desc={t(
            'Choose a organization'
          )}
        >
          <Select
            name = "organizationName" 
            options={this.getOrgOptions()}
          />
        </Form.Item>
        <Form.Item
          label={t('选择节点')}
          desc={t(
            'Choose peers'
          )}
        >
          <Select
            name = "peerName" 
            multi
            options={this.getPeerOptions()}
          />
        </Form.Item>
        <Form.Item>
          <Input
            className={styles.inputForOrg}
            name = "channelName"
            defaultValue={this.getChannelName()}
          />
        </Form.Item>
        <Form.Item>
          <Input
            name = "chainCodeVersion"
            defaultValue="1.0"
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
