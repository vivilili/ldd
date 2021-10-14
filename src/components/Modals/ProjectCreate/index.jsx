/*
ljw
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
export default class ProjectCreateModal extends React.Component {
  // 1 在state中定义了需要通信的数据
  state = {
    visible: false,
    fabricnamespace: '',
    ordernumber: '',
    ordererport:'',
    chainname:'',
    orgname:'',
    peernumber:'',
    peerport:'',
    consortiumname:'',
    consortiumframework:'',
    peerpassword:'',
    masterhostip:'',
    description:''
    
  }

  componentDidUpdate(){
    // this.createAlliancePost().then(r => console.log(r)).catch(e=>e)
  }

  // 创建联盟函数
  // 2 使用受控组件ref接收前台的数据数据
  createAlliance = () => {
    const input1 = this.refs.fabricnamespace.state.value
    const input2 = this.refs.ordernumber.state.value
    const input3 = this.refs.ordererport.state.value
    const input4 = this.refs.chainname.state.value
    const input5 = this.refs.orgname.state.value
    const input6 = this.refs.peernumber.state.value
    const input7 = this.refs.peerport.state.value
    const input8 = this.refs.consortiumname.state.value
    const input9 = this.refs.consortiumframework.state.value
    const input10 = this.refs.peerpassword.state.value
    const input11 = this.refs.masterhostip.state.value
    const input12 = this.refs.description.state.value
    console.log("受控组件获取前端数据1",input1)
    console.log(this.props.children)
    // 3 使用setState将前台数据写到状态中
    this.setState({
      visible: false,
      fabricnamespace: input1,
      ordernumber: input2,
      ordererport: input3,
      chainname: input4,
      orgname: input5,
      peernumber: input6,
      peerport: input7,
      consortiumname: input8,
      consortiumframework: input9,
      peerpassword:input10,
      maserhostip:input11,
      description: input12,
    },console.log(this.state))
  };
  // 4 使用回调函数 this.props.getMsg(this.state)将数据传回给父组件

  createAlliancePost = async () => {
    const {fabricnamespace, ordernumber,ordererport,chainname,orgname,peernumber,peerport,consortiumname,consortiumframework,peerpassword,masterhostip,description} = this.state
    console.log("获取联盟前台数据2：",this.state)
    // console.log(this.props.children)
    const params = {
      "namespace":fabricnamespace,
      "orderer_num":ordernumber,
      "orderer_ports":[7050,8050,9050],
      "chain_name":chainname,
      "peer_num":peernumber,
      "peer_ports":[7051,8051,9051],
      "init_org_name":orgname,
      "consortium_description":description,
      "consortium_name_display":consortiumname,
      "consortium_framework":consortiumframework,
      "master_host_ip":masterhostip,
      "passwords" :["123","456","789"],

    }
    // console.log(this.workspaceStore)
    await this.workspaceStore.createAlliancePost({
      params
    })
    // console.log(params,"异步结束")
    // await this.monitoringStore.fetchList({
    //
    // })
  }


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

    this.onOk = this.createAlliance()
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
        desc={t('Select the cluster to create the project.')}
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
    // console.log(this.props.onOk,"this.props")
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
            <div>{t('Create Alliance')}</div>
            {/*<p>{t('PROJECT_CREATE_DESC')}</p>*/}
          </div>
        </div>
        {/*模态框内的输入框*/}
        <div className={styles.content}>
          <Columns>
            {/*企业空间*/}
           <Column>
              <Form.Item
                label={t('FabricNamespace')}
                desc={t('SERVICE_NAME_DESC')}
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
                <Input name="metadata.fabricnamespace" ref="fabricnamespace" autoFocus={true} maxLength={63} defaultValue="bupt1"/>
              </Form.Item>
            </Column>
            {/*orderer节点数量*/}
            <Column>
              <Form.Item
                label={t('OrdererNumber')}
                desc={t('ORDERNUM_DESC')}
                ref={this.orderNumberRef}
              >
                <Input name="metadata.ordernumber" ref="ordernumber" autoFocus={true} maxLength={63} defaultValue="3"/>
              </Form.Item>
            </Column>
            {/*orderer节点端口*/}
            <Column>
              <Form.Item label={t('Ordererport')} desc={t('ORDERERPORT_DESC')}>
                <Input
                  name="metadata.Ordererport"
                  ref="ordererport"
                  defaultValue="7053 8053 9053"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*联盟名称*/}
            <Column>
              <Form.Item
                label={t('ChainName')}
                // desc={t('CHAIN_NAME_DESC')}
                ref={this.chainnameRef}
              >
                <Input name="metadata.chainname" ref="chainname" autoFocus={true}  defaultValue="bupt"/>
              </Form.Item>
            </Column>
            {/*组织名称*/}
            <Column>
              <Form.Item
                label={t('OrgName')}
                // desc={t('ORGNAME_DESC')}
                ref={this.orgNameRef}
              >
                <Input name="metadata.orgname" ref="orgname" autoFocus={true} maxLength={63} defaultValue="org1"/>
              </Form.Item>
            </Column>
            {/*peer节点数量*/}
            <Column>
              <Form.Item label={t('PeerNumber')}
                         // desc={t('PEERNUM_DESC')}
              >
                <Input
                  name="metadata.peernumber"
                  ref="peernumber"
                  defaultValue="3"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*公网ip*/}
            <Column>
              <Form.Item
                label={t('MasterHostIp')}
                ref={this.masterhostipRef}
              >
                <Input name="metadata.masterhostip"  ref="masterhostip" autoFocus={true} maxLength={63}  defaultValue="8.130.168.220"/>
              </Form.Item>
            </Column>
            {/*区块链名称*/}
            <Column>
              <Form.Item
                label={t('ConsortiumNameDisplay')}
                ref={this.consortiumnameRef}
              >
                <Input name="metadata.consortiumname"  ref="consortiumname" autoFocus={true} maxLength={63}  defaultValue="中科金财测试"/>
              </Form.Item>
            </Column>
            {/*底层架构*/}
            <Column>
              <Form.Item label={t('ConsortiumFramework')}>
                <Input
                  name="metadata.consortiumframework"
                  ref="consortiumframework"
                 defaultValue="中科金链4.0"
                />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            {/*peer节点端口*/}
            <Column>
              <Form.Item
                label={t('PeerPort')}
                desc={t('PEERPORT_DESC')}
                ref={this.peerportRef}
              >
                <Input name="metadata.peerport" ref="peerport" autoFocus={true}  defaultValue="7052 8052 9052"/>
              </Form.Item>
            </Column>
            {/*服务器密码*/}
            <Column>
              <Form.Item
                label={t('PeerPassword')}
                desc={t('PEERPASSWORD_DESC')}
                ref={this.peerpasswordRef}
              >
                <Input name="metadata.peerpassword" ref="peerpassword" autoFocus={true}  defaultValue="[123,456,789]"/>
              </Form.Item>
            </Column>
            {/*描述信息*/}
            <Column>
              <Form.Item label={t('Description')} desc={t('ALLIANCE_DESCRIPTION_DESC')}>
                <Input
                  name="metadata.description"
                  ref="description"
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
