import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import { mountComponent } from '@/utils/componentMount'
import type { MountComponentReturn } from '@/utils/componentMount'
import type { ConfirmDialogProps } from '~/components/common/ConfirmDialog.vue'

/** 确认弹窗挂载实例（包含 instance 和 unmount） */
const mountInstance = ref<MountComponentReturn<typeof ConfirmDialog> | null>(null)

/**
 * 确认弹窗管理 - 动态挂载模式
 */
export const useConfirmDialog = () => {
    /**
     * 打开确认弹窗
     */
    const open = (props: ConfirmDialogProps) => {
        // 如果实例已存在且已打开，直接返回
        const currentInstance = mountInstance.value?.instance
        const isOpenRef = currentInstance?.isOpen as Ref<boolean> | undefined
        if (isOpenRef?.value) {
            return
        }

        // 如果实例存在但未打开，直接打开
        if (currentInstance) {
            currentInstance.open?.()
            return
        }

        // 创建新的组件实例
        const mount = mountComponent(ConfirmDialog, {
            props,
            autoUnmount: true,
            watchStateKey: 'isOpen',
            unmountDelay: 300,
            onUnmounted: () => {
                mountInstance.value = null
            },
        })

        mountInstance.value = mount

        // 打开 dialog
        if (mount.instance) {
            mount.instance.open?.()
        }
    }

    /**
     * 关闭确认弹窗
     */
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
