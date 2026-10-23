import type sensors from '@joyme/sensors-data'
import type { I18n } from 'vue-i18n'
import type { InlineLoaderValue } from '@/directives/vInlineLoader'
import type { Offset, RedDotPosition, RedDotSize, RedDotTrigger } from '@/components/business/RedDotIndicator'

declare global {
    interface Window {
        $i18n: I18n<object, object, object, string> // 可以根据需要调整类型
        google: any // 可以根据需要调整类型
        gtag: any // google上报
        dataLayer: any // 谷歌上报
        KEWLSensors: typeof sensors & {
            busHandleLogin?: () => void
            busHandleLogout?: () => void
        }
        TONGDun: {
            getBlackBox: () => string
            clear: () => void
            init: (callback: (blackBox: string) => void) => void
        }
    }
}

// 扩展 NuxtApp 类型
declare module '#app' {
    interface NuxtApp {
        // 我们自定义的共享 i18n 实例
        $sharedI18n: I18n
    }
}

// 确保Vue指令的类型提示正确
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        vInlineLoader: InlineLoaderValue
        vRedDot: RedDotValue | undefined
    }
}

// 扩展 HTML 元素属性类型，支持 red-dot-* 属性
declare module '@vue/runtime-dom' {
    interface HTMLAttributes {
        /**
         * 红点偏移值，覆盖 v-red-dot 指令中的 offset 配置
         * @example
         * ```vue
         * <div v-red-dot="key" :red-dot-offset="{ x: -4, y: 2 }" />
         * ```
         */
        'red-dot-offset'?: Offset | string
        /**
         * 红点位置，覆盖 v-red-dot 指令中的 position 配置
         * @example
         * ```vue
         * <div v-red-dot="key" red-dot-position="top" />
         * ```
         */
        'red-dot-position'?: RedDotPosition | string
        /**
         * 红点尺寸，覆盖 v-red-dot 指令中的 size 配置
         * @example
         * ```vue
         * <div v-red-dot="key" red-dot-size="middle" />
         * ```
         */
        'red-dot-size'?: RedDotSize | string
        /**
         * 红点触发方式，覆盖 v-red-dot 指令中的 trigger 配置
         * @example
         * ```vue
         * <div v-red-dot="key" red-dot-trigger="hover" />
         * ```
         */
        'red-dot-trigger'?: RedDotTrigger | string
    }
}
