import React from 'react'
import BlockInfo from './BlockInfo'
import BlockCharts from './BlockCharts'
import BlockPages from './BlockPage'

export default class BlockBrowser extends React.Component {
  render() {
    return <div>
      <BlockInfo/>
      <BlockCharts/>
      <BlockPages/>
    </div>
  }
}



