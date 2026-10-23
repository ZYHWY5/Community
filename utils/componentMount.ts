import {
    createVNode,
    render,
    watch,
    type Component,
    type ComponentInstance,
    type VNode,
} from 'vue'

/**
 * 组件挂载选项
 */
export interface MountComponentOptions<Props = Record<string, any>> {
    /** 组件 props */
    props?: Props
    /** 组件挂载后的回调 */
    onMounted?: () => void
    /** 组件卸载前的回调 */
    onUnmounted?: () => void
    /** 自定义容器元素选择器，默认为 body */
    containerEl?: string | HTMLElement
    /** 卸载延迟时间（毫秒），用于等待动画完成，默认 300ms */
    unmountDelay?: number
    /** 是否自动监听状态变化并自动卸载，默认 false */
    autoUnmount?: boolean
    /** 监听的状态属性名，用于自动卸载，默认为 'isOpen' */
    watchStateKey?: string
}

/**
 * 从 Component 类型中提取 Props 类型
 * 参考 h 函数的实现方式，支持所有组件类型（Component、DefineComponent、FunctionalComponent 等）
 * 直接从 ComponentInstance 的 $props 属性提取，这样可以正确处理 script setup 的组件
 */
type ExtractComponentProps<T> = ComponentInstance<T>['$props']
/**
 * 组件挂载返回值
 */
export interface MountComponentReturn<T extends Component = Component> {
    /** 组件实例（实际组件实例类型，可通过 defineExpose 暴露的方法和属性，包括响应式属性） */
    instance: ComponentInstance<T> | null
    /** 容器元素 */
    container: HTMLElement | null
    /** 手动卸载函数 */
    unmount: () => void
}

/**
 * 动态挂载组件（使用 createVNode + render 方案）
 *
 * 在主应用的上下文中直接渲染组件，完全共享主应用的所有环境。
 * 优势：自动继承所有 provide/inject、全局属性、指令、组件、插件等，无需手动维护
 *
 * @param Component - 要挂载的组件
 * @param options - 挂载选项和组件 props
 * @returns 组件实例、容器和卸载函数
 *
 * @example
 * ```ts
 * // 基本使用
 * const { instance, unmount } = mountComponent(MyDialog, {
 *   props: { title: 'Hello', open: true },
 *   onMounted: () => console.log('mounted'),
 *   onUnmounted: () => console.log('unmounted'),
 * })
 *
 * // 自动卸载（监听 isOpen 状态）
 * const { instance } = mountComponent(ConfirmDialog, {
 *   props: { open: true, message: 'Are you sure?' },
 *   autoUnmount: true,
 * })
 * ```
 */
export function mountComponent<T extends Component = Component>(
    Component: T,
    options?: MountComponentOptions<ExtractComponentProps<T>>,
): MountComponentReturn<T> {
    const opts = options || {}

    // SSR 兼容
    if (import.meta.server) {
        return {
            instance: null,
            container: null,
            unmount: () => {},
        }
    }

    // 获取 Nuxt 应用实例
    const nuxtApp = useNuxtApp()
    const mainVueApp = nuxtApp.vueApp

    // 在主应用的上下文中执行
    return mainVueApp.runWithContext(() => {
        let container: HTMLElement | null = null
        let vnode: VNode | null = null
        let instance: ComponentInstance<T> | null = null
        let stopWatcher: (() => void) | null = null
        let unmountTimer: ReturnType<typeof setTimeout> | null = null

        try {
            // 创建容器元素
            container = document.createElement('div')

            // 确定挂载目标
            let appendTarget: HTMLElement
            if (opts.containerEl) {
                if (typeof opts.containerEl === 'string') {
                    appendTarget = document.querySelector(opts.containerEl) || document.body
                }
                else {
                    appendTarget = opts.containerEl
                }
            }
            else {
                appendTarget = document.body
            }

            // 创建 VNode
            vnode = createVNode(Component, opts.props || {})

            // 设置应用上下文，自动继承所有主应用配置
            // 包括: provide/inject、全局指令、全局组件、插件（Pinia、i18n）等
            vnode.appContext = mainVueApp._context

            // 渲染组件到容器
            render(vnode, container)

            // 挂载到 DOM
            appendTarget.appendChild(container)

            // 使用 nextTick 确保组件渲染完成
            // nextTick(() => {
            // 从 vnode 获取组件实例
            // 优先使用 exposed（通过 defineExpose 暴露的）
            // 如果没有 exposed，则使用 proxy（完整实例）
            if (vnode && vnode.component) {
                instance = (vnode.component.exposed || vnode.component.proxy) as ComponentInstance<T> | null
            }

            // 触发挂载回调
            opts.onMounted?.()

            // 如果启用自动卸载，监听状态变化
            if (opts.autoUnmount === true && instance) {
                const stateKey = opts.watchStateKey || 'isOpen'
                const stateValue = (instance as Record<string, any>)[stateKey]

                // 检查状态值是否存在
                if (stateValue !== undefined) {
                    stopWatcher = watch(
                        () => {
                            const currentState = (instance as Record<string, any>)?.[stateKey]
                            // 处理 Ref、ComputedRef 或普通值
                            if (currentState && typeof currentState === 'object' && 'value' in currentState) {
                                return currentState.value
                            }
                            return currentState
                        },
                        (val, prev) => {
                            // 状态从 true 变为 false 时触发卸载
                            if (prev === true && val === false) {
                                const delay = opts.unmountDelay ?? 300
                                unmountTimer = setTimeout(() => {
                                    unmount()
                                }, delay)
                            }
                        },
                        { immediate: false },
                    )
                }
            }
            // })

            // 卸载函数
            const unmount = () => {
                // 清理定时器
                if (unmountTimer) {
                    clearTimeout(unmountTimer)
                    unmountTimer = null
                }

                // 停止监听
                if (stopWatcher) {
                    stopWatcher()
                    stopWatcher = null
                }

                // 触发卸载前回调
                opts.onUnmounted?.()

                try {
                    // 使用 render(null, container) 卸载组件
                    if (container) {
                        render(null, container)

                        // 移除容器元素
                        if (container.parentNode) {
                            container.parentNode.removeChild(container)
                        }
                    }
                }
                catch (error) {
                    console.warn('[componentMount] Error during unmount:', error)
                }
                finally {
                    container = null
                    vnode = null
                    instance = null
                    stopWatcher = null
                }
            }

            return {
                instance,
                container,
                unmount,
            }
        }
        catch (error) {
            console.error('[componentMount] Error mounting component:', error)

            // 清理已创建的资源
            if (container) {
                if (vnode) {
                    render(null, container)
                }
                if (container.parentNode) {
                    container.parentNode.removeChild(container)
                }
            }

            return {
                instance: null,
                container: null,
                unmount: () => {},
            }
        }
    })
}
