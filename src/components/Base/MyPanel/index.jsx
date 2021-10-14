/*
dxk
ljw
 */

import React, { useState } from 'react'
import classNames from 'classnames'

import { Loading, Button, Column, Columns, Select, Icon, Alert, InputSearch, Input } from '@kube-design/components'
import { Modal } from 'components/Base'
import styles from './index.scss'
import { observer, inject } from 'mobx-react'

@observer
export default class Panel extends React.Component {
  //2 state中定义需要通信的属性变量
  state = {
    //控制模态是否可见
    visible: false,
    channelName: '',
    channelDescription: '',
    channelMember: '',
    deleteAlliance: false,
    org: {
      new_org_name: '',
      new_org_peer_ports: '',
      organizationDescriptions: '',
    },
    chaincode: {
      chainCodeLanguage: '',
      description: '',
      chainCodeFile: ''
    }

  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    })
  };
  //点击确认 绑定事件 提交数据
  handleOk = () => {
    const { extras } = this.props
    if (extras === 'Channel') {
      return this.createChannel()
    } else if (extras === 'Alliance') {
      return this.deleteAlliance()
    } else if (extras === 'Organization') {
      return this.createOrganization()
    } else if (extras === 'ChainCodeDepository') {
      return this.uploadChainCode()
    }
  }
  // 删除联盟函数
  deleteAlliance = () => {
    this.setState({
      visible: false,
      deleteAlliance: true
    }, () => this.props.getMsg(this.state));
  };
  // 创建通道函数
  createChannel = () => {
    const input1 = this.refs.channelName.state.value
    const input2 = this.refs.channelDescription.state.value
    this.setState({
      visible: false,
      channelName: input1,
      channelDescription: input2,
    }, () => this.props.getMsg(this.state));
  };
  
  // 处理文件
  // handleFileChange = (e) => {
  //   console.log(e.currentTarget.files[0]);
  //   const file = e.currentTarget.files[0];
  //   const reader = new FileReader();

  //   reader.onload = function() {
  //     // reader.results当完成onload后会将图片转为base64
  //     // 后端只要解析base64对应的字符串即可
  //     const result = this.result;
  //     return result
  //   };
  //   // 得到经过base64编码的
  //   reader.readAsDataURL(file); 
  // };

  //上传链码函数
  //3 接收需要通信的属性 并写入state中 再调用回调函数将值传给父组件
  uploadChainCode = () => {
    const input1 = this.refs.chainCodeLanguage.state.value
    const input2 = this.refs.description.state.value
    const input3 = document.querySelector('#chainCodeFile').files[0]
    this.setState({
      visible: false,
      chaincode: {
        chainCodeLanguage: input1,
        description: input2,
        chainCodeFile: input3,
      }
    }, () => this.props.getMsg(this.state.chaincode));
  }

  createOrganization = () => {
    const input1 = this.refs.new_org_name.state.value
    const input2 = this.refs.new_org_peer_ports.state.value
    const input3 = this.refs.organizationDescriptions.state.value
    this.setState({
      visible: false,
      org: {
        new_org_name: input1,
        new_org_peer_ports: input2,
        organizationDescriptions: input3
      }
    }, () => this.props.getMsg(this.state.org));
  }

  renderBOS() {
    const options = [{
      label: "通道一",
      value: 1
    }, {
      label: "通道二",
      value: 2
    }, {
      label: "通道三",
      value: 3
    }, {
      label: "通道四",
      value: 4
    }];
    const { extras } = this.props
    const button1 = <Button className={styles.button} onClick={this.showModal}>添加组织</Button>
    const button2 = <Button className={styles.button} onClick={this.showModal}>上传链码</Button>
    const button3 = <Button className={styles.button} onClick={this.showModal}>删除联盟</Button>
    const button4 = <Button className={styles.button} onClick={this.showModal}>开通数据存证</Button>
    const button5 = <Button className={styles.button} onClick={this.showModal}>创建通道</Button>
    const select = <Select
      name="select"
      className={styles.select}
      options={options}
      value={1} />
    // return (extras === 'ChainCode' ? select : button)
    if (extras === 'ChainCode') {
      return select
    } else if (extras === 'Organization') {
      return button1
    } else if (extras === 'Alliance') {
      return button3
    } else if (extras === 'ChainCodeDepository') {
      return button2
    } else if (extras === 'DataAttestation') {
      return button4
    } else if (extras === 'Channel') {
      return button5
    } else {
      return null
    }

  }
  //数据存证
  renderDataSelect() {
    const options = [{
      value: "联盟1",
      label: "联盟1"
    }, {
      value: "联盟2",
      label: "联盟2"
    }, {
      value: "联盟3",
      label: "联盟3",
      disabled: true
    }, {
      value: "联盟4",
      label: "联盟4"
    }];
    const options2 = [{
      label: "通道1",
      options: [{
        value: "CentOS-5.8",
        label: "CentOS 5.8 32bit"
      }, {
        value: "CentOS-6.6",
        label: "CentOS 6.6 64bit",
        disabled: true
      }, {
        value: "CentOS-7",
        label: "CentOS 7 64bit"
      }]
    }, {
      label: "通道2",
      options: [{
        value: "Debian-8.3",
        label: "Debian Jessie 8.3 64bit"
      }, {
        value: "Debian-9.3",
        label: "Debian Stretch 9.3 64bit"
      }]
    }];
    const options3 = [
      {
        label: "fabric",
        value: 1
      },
      {
        label: "fiscoBcos",
        value: 2
      }
    ];
    return <>
      <div>
        <p>选择架构</p>
        <Select name="select" options={options3} value={1} />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>选择联盟</p>
        <Select prefixIcon={<Icon name="cluster" />} options={options} name="select" defaultValue="联盟1" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>选择通道</p>
        <Select options={options2} name="select" defaultValue="通道1" />
      </div>
    </>;
  }
  //创建通道
  renderChannelSelect() {
    // const options = [{
    //   value: "CentOS",
    //   label: "CentOS 5.8 32bit"
    // }, {
    //   value: "Debian",
    //   label: "Debian Jessie 8.1 64bit"
    // }, {
    //   value: "Ubuntu",
    //   label: "Ubuntu Server 14.04.3 LTS 64bit",
    //   disabled: true
    // }, {
    //   value: "Windows",
    //   label: "Windows Server 2003 R2"
    // }];
    return <>
      <div>
        <p>通道名称</p>
        <Input name="channelName" ref="channelName" placeholder="请输入通道名称" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>通道描述</p>
        <Input name="channelDescription" ref="channelDescription" placeholder="请输入通道描述" />
      </div>
      {/*<div style={{*/}
      {/*  marginTop: "10px"*/}
      {/*}}>*/}
      {/*  <p>通道成员</p>*/}
      {/*  <Select multi name="select-multi" options={options} />*/}
      {/*</div>*/}
    </>;
  }
  //邀请组织
  renderOrgSelect() {
    return <>
      <div>
        <p>组织名称</p>
        <Input name="new_org_name" ref="new_org_name" placeholder="请输入新组织名称" defaultValue="neworg" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>节点端口</p>
        <Input name="new_org_peer_ports" ref="new_org_peer_ports" placeholder="请输入节点端口(个数代表数量,逗号隔开)" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>组织描述</p>
        <Input name="organizationDescriptions" ref="organizationDescriptions" placeholder="请输入组织描述" defaultValue="test" />
      </div>
    </>;
  }
  //上传链码
  //1 在前台标签框中标识需要传值的属性
  renderChaincodeSelect() {
    const options = [{
      value: "golang",
      label: "golang"
    }, {
      value: "solidity",
      label: "solidity"
    }];
    return <>

      <div>
        <p>链码语言</p>
        <Select name="chainCodeLanguage" ref="chainCodeLanguage" options={options} value={"golang"} />
      </div>
      <div>
        <p>链码描述</p>
        <Input name="description" ref="description" placeholder="请输入链码描述" defaultValue="测试中科金链" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>选择链码</p>
        <Input name="chainCodeFile" id="chainCodeFile" ref="chainCodeFile" 
        type={"file"} placeholder="请选择链码文件" /* onChange={this.handleFileChange.bind(this)} */ />
      </div>
    </>;
  }
  //创建联盟
  renderCreateAlliance() {
    const options = [{
      value: "联盟1",
      label: "联盟1"
    }, {
      value: "联盟2",
      label: "联盟2"
    }, {
      value: "联盟3",
      label: "联盟3",
      disabled: true
    }, {
      value: "联盟4",
      label: "联盟4"
    }];
    const options2 = [{
      label: "通道1",
      options: [{
        value: "CentOS-5.8",
        label: "CentOS 5.8 32bit"
      }, {
        value: "CentOS-6.6",
        label: "CentOS 6.6 64bit",
        disabled: true
      }, {
        value: "CentOS-7",
        label: "CentOS 7 64bit"
      }]
    }, {
      label: "通道2",
      options: [{
        value: "Debian-8.3",
        label: "Debian Jessie 8.3 64bit"
      }, {
        value: "Debian-9.3",
        label: "Debian Stretch 9.3 64bit"
      }]
    }];
    const options3 = [
      {
        label: "fabric",
        value: 1
      },
      {
        label: "fiscoBcos",
        value: 2
      }
    ];
    return <>
      <div>
        <p>联盟名称</p>
        <Input name="chaincode" placeholder="please input a alliance name" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>选择联盟</p>
        <Select prefixIcon={<Icon name="cluster" />} options={options} name="select" defaultValue="联盟1" />
      </div>
      <div style={{
        marginTop: "10px"
      }}>
        <p>选择联盟</p>
        <Select options={options2} name="select" defaultValue="通道1" />
      </div>
    </>;
  }

  renderDeleteAlliance() {
    return (<div>
      <Alert type="warning" title="警告" message="此操作将删除联盟及其容器环境！ " />
    </div>)

  }

  //确定选中的模态框
  renderWhichOne() {
    const { extras, modal } = this.props
    // console.log("测试props中有什么？",this.props)
    if (extras === 'DataAttestation') {
      return this.renderDataSelect()
    }
    else if (extras === 'Channel') {
      return this.renderChannelSelect()
    }
    else if (extras === 'Organization') {
      return this.renderOrgSelect()
    } else if (extras === 'ChainCodeDepository') {
      return this.renderChaincodeSelect()
    } else if (extras === 'Alliance') {
      return this.renderDeleteAlliance()
    }
  }
  render() {
    const { className, title, loading = false, children, extras } = this.props
    const empty = (
      <div className={styles.empty}>
        {t('NOT_AVAILABLE', { resource: title })}
      </div>
    )

    return (
      <div
        className={styles.wrapper}
        data-test={`panel-${title
          ? title
            .toLowerCase()
            .split(' ')
            .join('-')
          : 'default'
          }`}
      >
        <Columns className={styles.columns}>
          <Column className={`is-1`}>
            {title && <div className={styles.title}>{title}</div>}
          </Column>
          <Column className={`is-10`}>

          </Column>
          <Column className={`is-1`}>
            {this.renderBOS()}
          </Column>
        </Columns>
        <div className={classNames(styles.panel, className)}>
          {loading ? <Loading className={styles.loading} /> : children || empty}
        </div>
        <Modal
          bodyClassName={styles.body}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width={480}
          icon="enterprise"
          title={<a onClick={this.handleEnterWorkspace}>{t('Open' + extras)}</a>}
        >
          <div >
            {this.renderWhichOne()}
          </div>
        </Modal>


      </div>
    )
  }
}
