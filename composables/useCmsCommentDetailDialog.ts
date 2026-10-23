import CommentDetailDialog from '~/components/cms/components/comment/Detail.vue'
import { mountComponent } from '@/utils/componentMount'
import type { MountComponentReturn } from '@/utils/componentMount'

const mountInstance = ref<MountComponentReturn<typeof CommentDetailDialog> | null>(null)

export const useCmsCommentDetailDialog = () => {
    const open = () => {
        const currentInstance = mountInstance.value?.instance
        const isOpenRef = currentInstance?.isOpen as Ref<boolean> | undefined
        if (isOpenRef?.value) {
            return
        }

        if (currentInstance) {
            currentInstance.open?.()
            return
        }

        const mount = mountComponent(CommentDetailDialog, {
            autoUnmount: true,
            watchStateKey: 'isOpen',
            unmountDelay: 300,
            onUnmounted: () => {
                mountInstance.value = null
            },
        })

        mountInstance.value = mount

        if (mount.instance) {
            mount.instance.open?.()
        }
    }

    const close = () => {
        const currentInstance = mountInstance.value?.instance
        if (currentInstance) {
            const isOpenRef = currentInstance.isOpen as unknown as Ref<boolean> | undefined
            if (isOpenRef?.value) {
                currentInstance.close?.()
            }
        }
    }

    return {
        open,
        close,
    }
}
