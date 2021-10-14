import React from 'react'
import BlockInfo from './BlockInfo'
import BlockCharts from './BlockCharts'
import BlockPages from './BlockPage'
// import MoreTran from "./MoreTran";
// import MoreBlock from "./MoreBlock";
// const PATH = '/clusters/:cluster/projects/:namespace'
export default class BlockBrowser extends React.Component {
  render() {
    // const props = this.props
    return <div>
      <BlockInfo >{this.props}</BlockInfo>
      <BlockCharts>{this.props}</BlockCharts>
      <BlockPages >{this.props}</BlockPages>

    </div>
  }
}



