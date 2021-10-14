import { Notify } from '@kube-design/components'
import { Modal } from 'components/Base'
import DeleteModal from 'components/Modals/Delete'

export default {
    'alliance.delete': {
      on({ store, detail, success, ...props }) {
        const modal = Modal.open({
          onOk: () => {
            store.delete(detail).then(() => {
              Modal.close(modal)
              Notify.success({ content: `${t('Deleted Successfully')}` })
              success && success()
            })
          },
          store,
          modal: DeleteModal,
          resource: detail.name,
          ...props,
        })
      },
    }
  }