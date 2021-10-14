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

import React from 'react'
import { observer } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import {
  Column,
  Columns,
  Form,
  Input,
  Select,
  TextArea,
} from '@kube-design/components'
import { Modal } from 'components/Base'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import { PATTERN_SERVICE_NAME } from 'utils/constants'
import WorkspaceStore from 'stores/workspace'
import { computed } from 'mobx'
import styles from './index.scss'

@observer
export default class AllianceCreate extends React.Component {
  static propTypes = {
    formTemplate: PropTypes.object,
    visible: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    formTemplate: {},
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.store = props.store
    this.workspaceStore = new WorkspaceStore()

    this.formRef = React.createRef()
    this.nameRef = React.createRef()
  }

  componentDidMount() {
    const { hideCluster } = this.props
    if (!hideCluster) {
      this.fetchClusters()
    }
  }

  get networkOptions() {
    return [
      { label: t('Off'), value: '' },
      { label: t('On'), value: 'enabled' },
    ]
  }

  @computed
  get clusters() {
    return this.workspaceStore.clusters.data.map(item => ({
      label: item.name,
      value: item.name,
      cluster: item,
      disabled: !item.isReady,
    }))
  }

  @computed
  get defaultClusters() {
    const clusters = this.workspaceStore.clusters.data
      .filter(item => item.isReady)
      .map(item => ({ name: item.name }))

    return isEmpty(clusters) ? undefined : clusters
  }

  fetchClusters(params) {
    this.workspaceStore.fetchClusters({
      ...params,
      workspace: this.props.workspace,
    })
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value.indexOf('kube-') === 0) {
      return callback({
        message: t('Name validation failed'),
        field: rule.field,
      })
    }

    const cluster =
      this.props.cluster || get(this.props.formTemplate, 'cluster')

    if (!cluster && globals.app.isMultiCluster) {
      return callback()
    }

    this.store.checkName({ name: value, cluster }).then(resp => {
      if (resp.exist) {
        return callback({ message: t('Name exists'), field: rule.field })
      }
      callback()
    })
  }

  handleClusterChange = () => {
    if (this.nameRef && this.nameRef.current) {
      const name = 'metadata.name'
      if (
        this.formRef &&
        this.formRef.current &&
        !isEmpty(this.formRef.current.state.errors)
      ) {
        this.formRef.current.resetValidateResults(name)
      }

      this.nameRef.current.validate({
        [name]: get(this.props.formTemplate, name),
      })
    }
  }

  valueRenderer = item => (
    <ClusterTitle cluster={item.cluster} size="small" noStatus />
  )

  optionRenderer = item => (
    <ClusterTitle cluster={item.cluster} size="small" theme="light" noStatus />
  )

  renderClusters() {
    return (
      <Form.Group
        label={t('Cluster Settings')}
        desc={t('Select the cluster to create the alliance.')}
      >
        <Form.Item
          rules={[{ required: true, message: t('Please select a cluster') }]}
        >
          <Select
            name="cluster"
            className={styles.cluster}
            options={this.clusters}
            defaultValue={this.props.defaultCluster}
            valueRenderer={this.valueRenderer}
            optionRenderer={this.optionRenderer}
            onChange={this.handleClusterChange}
          />
        </Form.Item>
      </Form.Group>
    )
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
        width={960}
        formRef={this.formRef}
        bodyClassName={styles.body}
        data={formTemplate}
        onCancel={onCancel}
        onOk={onOk}
        visible={visible}
        closable={false}
        isSubmitting={isSubmitting}
        hideHeader
      >
        <div className={styles.header}>
          <img src="/assets/project-create.svg" alt="" />
          <div className={styles.title}>
            <div>{t('CreateAlliance')}</div>
            {/*<p>{t('PROJECT_CREATE_DESC')}</p>*/}
          </div>
        </div>
        {/*模态框内的输入框*/}
        <div className={styles.content}>
          <Columns>
            {/*企业空间*/}
           <Column>
              <Form.Item
                label={t('namespace')}
                ref={this.nameRef}
                rules={[
                  { required: true, message: t('Please input name') },
                  {
                    pattern: PATTERN_SERVICE_NAME,
                    message: t('Invalid name', {
                      message: t('SERVICE_NAME_DESC'),
                    }),
                  },
                  { validator: this.nameValidator },
                ]}
              >
                <Input name="metadata.namespace"  autoFocus={true} maxLength={63} defaultValue="bupt1"/>
              </Form.Item>
            </Column>
            {/*orderer节点数量*/}
            <Column>
              <Form.Item
                label={t('orderer_num')}
              >
                <Input name="metadata.orderer_num"  autoFocus={true} maxLength={63} defaultValue="3"/>
              </Form.Item>
            </Column>
            {/*orderer节点端口*/}
            <Column>
              <Form.Item label={t('orderer_ports')} >
                <Input
                  name="metadata.orderer_ports"
                  defaultValue="7050,8050,9050"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*联盟名称*/}
            <Column>
              <Form.Item
                label={t('chain_name')}
                // desc={t('CHAIN_NAME_DESC')}
                ref={this.chainnameRef}
              >
                <Input name="metadata.chain_name"  autoFocus={true}  defaultValue="bupt"/>
              </Form.Item>
            </Column>
            {/*组织名称*/}
            <Column>
              <Form.Item
                label={t('init_org_name')}
                // desc={t('ORGNAME_DESC')}
                ref={this.orgNameRef}
              >
                <Input name="metadata.init_org_name" autoFocus={true} maxLength={63} defaultValue="org1"/>
              </Form.Item>
            </Column>
            {/*peer节点数量*/}
            <Column>
              <Form.Item label={t('peer_num')}
                         // desc={t('PEERNUM_DESC')}
              >
                <Input
                  name="metadata.peer_num"
                  defaultValue="3"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*公网ip*/}
            <Column>
              <Form.Item
                label={t('master_host_ip')}
              >
                <Input name="metadata.master_host_ip"  autoFocus={true} maxLength={63}  defaultValue="8.130.168.220"/>
              </Form.Item>
            </Column>
            {/*区块链名称*/}
            <Column>
              <Form.Item
                label={t('consortium_name_display')}
              >
                <Input name="metadata.consortium_name_display"   autoFocus={true} maxLength={63}  defaultValue="中科金财测试"/>
              </Form.Item>
            </Column>
            {/*底层架构*/}
            <Column>
              <Form.Item label={t('consortium_framework')}>
                <Input
                  name="metadata.consortium_framework"
                 defaultValue="中科金链4.0"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*peer节点端口*/}
            <Column>
              <Form.Item
                label={t('peer_ports')}
                // desc={t('PEERPORT_DESC')}
              >
                <Input name="metadata.peer_ports" autoFocus={true}  defaultValue="7051,8051,9051"/>
              </Form.Item>
            </Column>
            {/*服务器密码*/}
            <Column>
              <Form.Item
                label={t('passwords')}
                // desc={t('PEERPASSWORD_DESC')}
              >
                <Input name="metadata.passwords"  autoFocus={true}  defaultValue="Bupt1234!,Bupt1234!,Bupt1234!"/>
              </Form.Item>
            </Column>
            {/*描述信息*/}
            <Column>
              <Form.Item label={t('consortium_description')} /* desc={t('ALLIANCE_DESCRIPTION_DESC')} */>
                <Input
                  name="metadata.consortium_description"
                  defaultValue="中科金链4.0"
                />
              </Form.Item>
            </Column>
          </Columns>
          {!hideCluster && this.renderClusters()}
        </div>
      </Modal.Form>
    )
  }
}
