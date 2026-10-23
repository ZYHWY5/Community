import ImgPreview from '~/components/player-community/components/image/ImgPreview.vue'
import { mountComponent } from '@/utils/componentMount'
import type { MountComponentReturn } from '@/utils/componentMount'

export interface OpenImagePreviewOptions {
    images: string[]
    index?: number
}

/** 图片预览弹窗挂载实例（包含 instance 和 unmount） */
const mountInstance = ref<MountComponentReturn<typeof ImgPreview> | null>(null)

/**
 * 图片预览弹窗管理 - 动态挂载模式
 */
export const useImagePreview = () => {
    /**
     * 打开图片预览弹窗
     * @param options.images - 图片 URL 列表
     * @param options.index - 默认展示的图片索引
     */
    const open = (options: OpenImagePreviewOptions) => {
        // 如果实例已存在，先卸载再重建（确保 props 更新）
        if (mountInstance.value) {
            mountInstance.value.unmount()
            mountInstance.value = null
        }

        // 创建新的组件实例，传入 props
        const mount = mountComponent(ImgPreview, {
            props: {
                images: options.images,
                index: options.index ?? 0,
            },
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
     * 关闭图片预览弹窗
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
