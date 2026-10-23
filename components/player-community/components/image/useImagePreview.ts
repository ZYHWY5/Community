import { useImagePreview as useImagePreviewCom } from '~/composables/useImagePreview'
import type { OpenImagePreviewOptions } from '~/composables/useImagePreview'

export const useImagePreview = () => {
    const open = (options: OpenImagePreviewOptions) => {
        useImagePreviewCom().open({
            images: options.images,
            index: options.index ?? 0,
        })
    }
    const close = () => {
        useImagePreviewCom().close()
    }
    return { open, close }
}
