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

import { getIndexRoute } from 'utils/router.config'
//导入组件
import Overview from './Overview'
import Pods from './Pods'
import Gateway from './Gateway'
import Quota from './Quota'
import BlockBrowser from "./BlockBrowser";
import Organization from "./Organization";
import Channel from "./Channel";
import ChainCode from "./ChainCode";
import ChainCodeDepository from "./ChainCodeDepository";
import MoreTran from "./MoreTran";
import MoreBlock from "./MoreBlock";
import BlockDetail from "./BlockDetail"
import Alliance from "./Alliance";
import DataAttestation from "./DataAttestation";
// import Test from "./Test";



const PATH = '/clusters/:cluster/projects/:namespace'
//暴露组件的路径
export default [
  // {
  //   path: `${PATH}/test`,
  //   title: 'Test',
  //   component: Test,
  //   exact: true,
  // },
  {
    path: `${PATH}/alliance`,
    title: 'AllianceMent',
    component: Alliance,
    exact: true,
  },
  {
    path: `${PATH}/blockBrowser`,
    title: 'BlockBrowserMin',
    component: BlockBrowser,
    exact: true,
  },
  {
    path: `${PATH}/organization`,
    title: 'OrganizationManagement',
    component: Organization,
    exact: true,
  },
  {
    path: `${PATH}/channel`,
    title: 'ChannelManagement',
    component: Channel,
    exact: true,
  },
  {
    path: `${PATH}/chainCodeDepository`,
    title: 'ChainCodeDepository',
    component: ChainCodeDepository,
    exact: true,
  },
  {
    path: `${PATH}/chainCode`,
    title: 'ChainCodeManagement',
    component: ChainCode,
    exact: true,
  },
  

  {
    path: `${PATH}/moreblock`,
    title: 'MoreBlockCheck',
    component: MoreBlock,
    exact: true,
  },
  {
    path: `${PATH}/moretran`,
    title: 'MoreTranCheck',
    component: MoreTran,
    exact: true,
  },
  {
    path: `${PATH}/blockDetail`,
    title: 'BlockdetailCheck',
    component: BlockDetail,
    exact: true,
  },
  {
    path: `${PATH}/dataAttestation`,
    title: 'DataAttestation',
    component: DataAttestation,
    exact: true,
  },
  {
    path: `${PATH}/overview`,
    title: 'Project Overview',
    component: Overview,
    exact: true,
  },
  { path: `${PATH}/pods`, title: 'Pods', component: Pods, exact: true },
  {
    path: `${PATH}/gateway`,
    title: 'Gateway Info',
    component: Gateway,
    exact: true,
  },
  {
    path: `${PATH}/quota`,
    title: 'Project Quota',
    component: Quota,
    exact: true,
  },
  
  getIndexRoute({ path: PATH, to: `${PATH}/alliance`, exact: true }),
]
