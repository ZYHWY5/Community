import { createApp, watch } from 'vue'
import type { DefineComponent } from 'vue'

export interface MountDialogOptions {
    onOpen?: () => void
    onClose?: () => void
    withI18n?: boolean
    containerEl?: string
}
// 基础暴露接口
export interface BaseDialogExposed {
    open?: () => void
    close?: () => void
    initSetup?: (props: any) => void
    isOpen: Ref<boolean>
}
type InitSetupParam<T> = T extends { initSetup: (props: infer P) => any } ? P : never
export function mountDialog<T extends DefineComponent<any, any, any>>(
    DialogComponent: T,
    dialogProps: Omit<MountDialogOptions, 'props'> & {
        props: InitSetupParam<InstanceType<T>>
    },
) {
    let appInstance: ReturnType<typeof createApp> | null = null
    let container: HTMLDivElement | null = null
    let instance: InstanceType<typeof DialogComponent> | null = null
    if (import.meta.server) {
        return { instance }
    }

    appInstance = createApp(DialogComponent)

    // ✅ 使用全局共享 i18n 实例,所有应用共享同一实例
    if (dialogProps.withI18n === undefined || dialogProps.withI18n) {
        const { $sharedI18n } = useNuxtApp()
        appInstance.use($sharedI18n)
    }

    container = document.createElement('div')
    const appendContainer = dialogProps.containerEl ? document.querySelector(dialogProps.containerEl) || document.body : document.body
    appendContainer.appendChild(container)
    instance = appInstance.mount(container) as unknown as InstanceType<typeof DialogComponent>

    if (typeof instance?.initSetup === 'function') {
        instance?.initSetup(dialogProps.props)
    }
    watch(() => instance?.isOpen, (val, prev) => {
        if (val && !prev) {
            dialogProps.onOpen?.()
        }
        if (!val && prev) {
            dialogProps.onClose?.()
            setTimeout(() => {
                appInstance?.unmount()
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container)
                }
            }, 300)
        }
    })

    return { instance }
}
