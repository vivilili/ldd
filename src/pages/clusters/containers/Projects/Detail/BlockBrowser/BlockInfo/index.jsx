import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'
import { getLastMonitoringData, getAreaChartOps } from 'utils/monitoring'
import ClusterMonitorStore from 'stores/monitoring/cluster'
import { SimpleArea } from 'components/Charts'
import { HorizontalStatusTabs } from 'components/Cards/Monitoring'
import TabItem from './Tab'
import {Select} from "@kube-design/components";
import styles from "./index.scss"

const MetricTypes = {
    cpu_usage: 'cluster_cpu_usage',
    cpu_total: 'cluster_cpu_total',
    cpu_utilisation: 'cluster_cpu_utilisation',
    memory_usage: 'cluster_memory_usage_wo_cache',
    memory_total: 'cluster_memory_total',
    memory_utilisation: 'cluster_memory_utilisation',
    disk_size_usage: 'cluster_disk_size_usage',
    disk_size_capacity: 'cluster_disk_size_capacity',
    disk_utilisation: 'cluster_disk_size_utilisation',
    pod_count: 'cluster_pod_running_count',
    pod_capacity: 'cluster_pod_quota',
}
@inject('rootStore')
@observer
export default class BlockInfo extends React.Component {


    constructor(props) {
        super(props)

        this.monitorStore = new ClusterMonitorStore({ cluster: props.cluster })
        this.state = {
            resourceType: 'application',
            range: 43200,
        }
    }

    get routing() {
        return this.props.rootStore.routing
    }

    get metrics() {
        return this.monitorStore.data
    }

    fetchData = (params = {}) => {
        this.monitorStore.fetchMetrics({
            metrics: Object.values(MetricTypes),
            step: '5m',
            times: 100,
            ...params,
        })
    }

    getValue = data => get(data, 'value[1]', 0)

    getTabOptions = () => {
        const lastData = getLastMonitoringData(this.metrics)

        const result = [
            {
                name: 'Blocks',
                unitType: '区块',
                used: this.getValue(lastData[MetricTypes.cpu_usage]),
                total: this.getValue(lastData[MetricTypes.cpu_total]),
            },
            {
                name: 'Transactions',
                unitType: '交易',
                used: this.getValue(lastData[MetricTypes.memory_usage]),
                total: this.getValue(lastData[MetricTypes.memory_total]),
            },
            {
                name: 'Peer',
                unitType: '节点',
                used: this.getValue(lastData[MetricTypes.disk_size_usage]),
                total: this.getValue(lastData[MetricTypes.disk_size_capacity]),
            },
            {
                name: 'Organization',
                unit: '',
                used: this.getValue(lastData[MetricTypes.pod_count]),
                total: this.getValue(lastData[MetricTypes.pod_capacity]),
            },
        ]

        return result.map(item => ({
            props: item,
            component: TabItem,
        }))
    }
    //控制显示相应的折线图
    getContentOptions = () => {
        const result = [
            {
                type: 'utilisation',
                title: 'Blocks',
                unit: '个',
                legend: ['Utilization'],
                data: get(this.metrics, `${MetricTypes.cpu_utilisation}.data.result`),
                // data: 200,
            },
            {
                type: 'utilisation',
                title: 'Transactions',
                unit: '个',
                legend: ['Utilization'],
                data: get(
                  this.metrics,
                  `${MetricTypes.memory_utilisation}.data.result`
                ),
            },
            {
                type: 'utilisation',
                title: 'Peer',
                unit: '个',
                legend: ['Utilization'],
                data: get(this.metrics, `${MetricTypes.disk_utilisation}.data.result`),
            },
            {
                type: 'utilisation',
                title: 'Organization',
                unit: '个',
                legend: ['Count'],
                data: get(this.metrics, `${MetricTypes.pod_count}.data.result`),
            },
        ]

        return result.map(item => ({
            props: item,
            render: this.renderChart,
        }))
    }
    //右侧折线图
    renderChart(option) {
        const commonProps = {
            key: option.title,
            width: '100%',
            height: '100%',
        }

        switch (option.type) {
            default:
            case 'area': {
                const config = getAreaChartOps(option)
                return <SimpleArea {...commonProps} {...config} />
            }
        }
    }

    render() {
        const { isLoading, isRefreshing } = this.monitorStore
        const options3 = [{
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
        return (
          <div className={styles.blockInfo}>
              <Select
                name="select"
                className={styles.select}
                options={options3}
                value={1}/>
              <HorizontalStatusTabs
                title={t('BlockBrowser')}
                tabOptions={this.getTabOptions()}
                contentOptions={this.getContentOptions()}
                loading={isLoading}
                refreshing={isRefreshing}
                onFetch={this.fetchData}
                style={{}}
              />
          </div>




        )
    }
}

