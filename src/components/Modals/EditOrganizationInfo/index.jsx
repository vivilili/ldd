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
import PropTypes from 'prop-types'
import copy from 'fast-copy'

import { Form, Input, TextArea, Select } from '@kube-design/components'
import { Modal } from 'components/Base'

export default class EditOrganizationInfoModel extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      formData: copy(props.detail),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({ formData: copy(this.props.detail) })
    }
  }

  handleOk = data => {
    const { onOk } = this.props
    onOk(data)
  }

  render() {
    const { visible, isSubmitting, onCancel } = this.props
    const { formData } = this.state
    const options = [{
      label: "活跃",
      value: "Active"
    }, {
      label: "停用",
      value: "Disabled"
    }];
    return (
      <Modal.Form
        data={formData}
        width={691}
        title={t('Edit Info')}
        icon="pen"
        onOk={this.handleOk}
        okText={t('Update')}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item label={t('organizationName')}>
          <Input name="item.spec.name" /* disabled */ />
        </Form.Item>
        <Form.Item label={t('organizationStatus')} /* desc={t('ALIAS_DESC')} */>
          <Select name="item.spec.status" maxLength={63} options={options} />
        </Form.Item>
        <Form.Item label={t('organizationDescriptions')} desc={t('DESCRIPTION_DESC')}>
          <TextArea
            name="item.spec.descriptions"
            maxLength={256}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
