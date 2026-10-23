import { toast } from 'vue-sonner'
import type { ExternalToast, Action } from 'vue-sonner'
import type { Component } from 'vue'

/**
 * Toast 选项类型，支持 action 按钮
 */
export type ToastOptions = ExternalToast

/**
 * Action 按钮配置
 * @example
 * {
 *   label: 'Undo',
 *   onClick: () => console.log('Undo clicked'),
 *   actionButtonStyle: { backgroundColor: '#000', color: '#fff' }
 * }
 */
export type ToastAction = Action

/**
 * 自定义按钮组件类型
 * action 可以直接传入一个 Vue 组件，实现完全自定义的按钮
 */
export type ToastActionComponent = Component

/**
 * @description 全局 Toast 组合式函数
 *
 * @example 基础用法
 * ```ts
 * const toast = useToast()
 * toast.success('操作成功')
 * ```
 *
 * @example 带描述和 action 按钮
 * ```ts
 * const toast = useToast()
 * toast.success('Event has been created', {
 *   description: 'Sunday, December 03, 2023 at 9:00 AM',
 *   action: {
 *     label: 'Undo',
 *     onClick: () => {
 *       console.log('Undo clicked')
 *       // 执行撤销操作
 *     },
 *     actionButtonStyle: {
 *       backgroundColor: '#000',
 *       color: '#fff',
 *       borderRadius: '4px',
 *       padding: '4px 12px',
 *     }
 *   }
 * })
 * ```
 *
 * @example 自定义按钮样式（使用 CSS 类）
 * ```ts
 * toast.error('删除失败', {
 *   action: {
 *     label: '重试',
 *     onClick: () => retryDelete(),
 *     actionButtonStyle: {
 *       backgroundColor: '#ef4444',
 *       color: '#fff',
 *     }
 *   },
 *   classes: {
 *     actionButton: 'custom-action-button-class'
 *   }
 * })
 * ```
 *
 * @example 使用自定义组件作为按钮（完全自定义）
 * ```ts
 * import { h } from 'vue'
 * import { Button } from '~/components/ui/button'
 * import Icon from '~/components/common/Icon.vue'
 *
 * const toast = useToast()
 *
 * // 方式1: 直接传入组件
 * toast.success('操作成功', {
 *   action: h(Button, {
 *     onClick: () => {
 *       console.log('自定义按钮被点击')
 *     },
 *     class: 'bg-black text-white rounded-lg px-4 py-2'
 *   }, {
 *     default: () => [
 *       h(Icon, { name: 'cs-icon:check', size: 16 }),
 *       ' 确认'
 *     ]
 *   })
 * })
 *
 * // 方式2: 使用 defineComponent 创建组件
 * const CustomActionButton = defineComponent({
 *   setup() {
 *     const handleClick = () => {
 *       console.log('自定义按钮点击')
 *     }
 *     return () => h(Button, {
 *       onClick: handleClick,
 *       variant: 'outline',
 *       class: 'rounded-full'
 *     }, {
 *       default: () => '自定义按钮'
 *     })
 *   }
 * })
 *
 * toast.info('消息', {
 *   action: CustomActionButton
 * })
 *
 * // 方式3: 在 Action 的 label 中使用组件
 * toast.warning('警告', {
 *   action: {
 *     label: h('span', { class: 'flex items-center gap-2' }, [
 *       h(Icon, { name: 'cs-icon:alert', size: 16 }),
 *       '查看详情'
 *     ]),
 *     onClick: () => {
 *       // 处理点击
 *     }
 *   }
 * })
 * ```
 *
 * @returns { show, success, error, info, warning }
 */
export function useToast() {
    return {
        show: toast,
        success: (message: string, options?: ToastOptions) =>
            toast.success(message, options),
        error: (message: string, options?: ToastOptions) =>
            toast.error(message, options),
        info: (message: string, options?: ToastOptions) =>
            toast.info(message, options),
        warning: (message: string, options?: ToastOptions) =>
            toast.warning(message, options),
    }
}
