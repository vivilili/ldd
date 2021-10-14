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
import { pick } from 'lodash'

import {Alert, Form, Input, Select} from '@kube-design/components'
import { Modal } from 'components/Base'
import clusterStore from "stores/monitoring/cluster"
import WorkspaceStore from 'stores/workspace'
import UserStore from 'stores/user'
import {toJS} from "mobx";

// @withList({
//   store: new clusterStore(),
//   name: 'Organization',
//   module: 'organization',
// })
export default class OrgJoinModal extends Component {
  state = {
    msg:{
      orgName:'',
      channelName: '',
    },
    pagination:{
      page:1,
    }

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
    // console.log("this.props.detail",this.props.detail.channelList.channels_info)
    // console.log("调用了getWorkspaces")
    return channels_info.map(item => ({
      label: item.channel_name,
      value: item.channel_name,
    }))
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
        title={t('Org_Join')}
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
          message={t('CHANNEL_JOIN_DESC')}
        />

        <Form.Item label={t('Seleted_Channel')} desc={t('Choose_a_channel')}>
          <Select
            name = "channelName"
            options={this.getWorkspaces()}
            clearable
          />
        </Form.Item>
        <Form.Item
          label={t('Seleted_Organization')}
          desc={t(
            'Choose_a_organization'
          )}
        >
          <Input name="orgName" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
