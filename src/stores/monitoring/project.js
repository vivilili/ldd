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

import { omit } from 'lodash'
import Base from './base'
import {action} from "mobx";

export default class ProjectMonitoring extends Base {
  handleParams = params => omit(params, ['cluster', 'workspace'])

  getApi = ({ workspace, namespace }) => {
    let path = '/namespaces'
    path += namespace ? `/${namespace}` : ''
    if (workspace && !namespace) {
      path = `/workspaces/${workspace}${path}`
    }
    return `${this.apiVersion}${path}`
  }

  //创建联盟
  @action
  async createAlliancePost({
                             params
                           } = {}){
    console.log("到了调用创建联盟的接口处了",params)
    this.statistics.isLoading = true
    const result = await to(request.post('kapis/consortiumcontroller.kubesphere.io/v1alpha1/initFabric', params))
    // console.log(params, '=========>>>>>>>>')
    this.statistics = {
      result,
      isLoading: false,
    }
    // console.log("获取的数据的 this.statistics", this.statistics)
    return result
  }
}
