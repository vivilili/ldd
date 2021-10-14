// // import React, { Component } from 'react'
// // import { toJS } from 'mobx'
// // import withList, { ListPage } from 'components/HOCs/withList'
// // import Table from 'components/Tables/List'
// // import TestStore from "stores/monitoring/cluster"//引入store
// // // import {Pagination} from "@kube-design/components";
// // @withList({
// //   store: new TestStore(),
// //   name: 'Tests',
// //   module: 'Test',
// // })
// //
// // export default class Test extends Component {
// //   monitoringStore = new TestStore()
// //   getData = async ({ }) => {  //获取接口
// //     await this.monitoringStore.fetchList({
// //       //填写参数
// //     })
// //   }
// //
// //   getTableProps() {
// //     const { tableProps } = this.props;
// //     console.log(this.props,"this.props信息")
// //   }
// //
// //   //表头
// //   getColumns = (record) => {
// //     //getColumns 的数据来自于 record，表面上并没有任何地方传入了 record (Test已经是根组件没有调用他的组件了)
// //     //record由浏览器打印可以看到是一条完整的table数据
// //     // console.log("表格当前记录",record)
// //
// //     return [
// //       {
// //         title: t('id'),
// //         dataIndex: 'spec.id',
// //         isHideable: true,
// //         width: '30%',
// //         render: this.renderStatus,
// //       },
// //       {
// //         title: t('channel_name'),
// //         dataIndex: 'spec.channel_name',
// //         isHideable: true,
// //         width: '30%',
// //         render: this.renderStatus,
// //       },
// //       {
// //         title: t('description'),
// //         dataIndex: 'spec.description',
// //         isHideable: true,
// //         width: '30%',
// //         render: this.renderStatus,
// //       },
// //       {
// //         title: t('organization_id'),
// //         dataIndex: 'spec.organization_id',
// //         isHideable: true,
// //         width: '30%',
// //         render: this.renderStatus,
// //       },
// //
// //     ]
// //   }
// //   render() {
// //
// //
// //
// //     const {  tableProps } = this.props;
// //     //真正的数据传入是tableProps
// //     const items =toJS(this.monitoringStore.statistics.result)
// //     // console.log("items的值：",items)
// //     if(items){
// //       tableProps.data = items.items
// //       console.log("真正的数据传入是tableProps",tableProps)
// //     }
// //
// //     // const pagination= {total: 9, page: 1, limit: 10}
// //     // const footer = <Pagination {...pagination}  />;
// //     return (
// //       <ListPage {...this.props} getData={this.getData} >
// //         <Table
// //           {...tableProps}
// //           {...this.getTableProps()}
// //           columns={this.getColumns()}
// //           // footer={footer}
// //         />
// //       </ListPage>
// //
// //     )
// //   }
// // }
//
// import React, { useState,useCallback,useRef,useEffect } from 'react';
// import PropTypes from 'prop-types'
// // import './upload.css';
//
// function App(props){
//
//   // const [arr,setArr] = useState([]);
//   const inputf = useRef(null);
//   const { disabled } = props;
//
//   const _onClick = useCallback(() => {
//     inputf.current.click();
//
//
//   }, [])
//
//   const _onChange = useCallback((ev) => {
//     let arr = [];
//     let files = ev.target.files;
//     Object.keys(files).forEach((item, index) => {
//       let fileReader = new FileReader();
//
//       fileReader.readAsDataURL(files[item]);
//       fileReader.onload = function (e)
//       {
//         arr.push({url:e.target.result,type:files[item].type,size:files[item].size,fileName:files[item].name});
//
//         if (arr.length==Object.keys(files).length)
//         {
//           props.onLoad(arr);
//         }
//       }
//
//     })
//
//
//
//
//   },[])
//
//   return(
//
//     <div className={`jf-upload-container ${!disabled&&'jf-upload-container-notDisabled'}`}>
//       <input  multiple ref={inputf} onChange={_onChange} type="file" className='je-upload-file' />
//       <i onClick={_onClick} className='iconfont icon-hao jf-upload-icon'>
//
//       </i>
//     </div>
//   )
// }
//
// App.propTypes = {
//   disabled: PropTypes.bool,
//   onLoad:PropTypes.func
// }
//
// App.defaultProps = {
//   onLoad:()=>{}
// }
//
//
// export default React.memo(App);
