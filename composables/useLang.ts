import type { UseI18nOptions } from 'vue-i18n'
// import { i18nImportMap } from '#build/i18n-dynamic-imports.mjs'

// i18nImportMap 现在是自动导入的

/**
 * 安全获取语言值，处理生命周期外的异常
 */
function tryGetLocale(getter: () => string | undefined): string | undefined {
    try {
        return getter() || undefined
    }
    catch {
        return undefined
    }
}

/**
 * 获取用户语言环境
 * 优先级：useCookieLocale() > useNuxtApp().$i18n.locale.value > 'en'
 */
export function getI18nLocale(): string {
    return (
        // tryGetLocale(() => useCookieLocale()?.value)??
        tryGetLocale(() => tryUseNuxtApp()?.$i18n?.locale.value) ?? 'en'
    )
}

/**
 * 获取所有已配置的语言列表 (服务端兼容)
 * 优先使用运行时配置，确保服务端和客户端都能正常工作
 */
export function getAvailableMessages(): NonNullable<UseI18nOptions['messages']> {
    try {
        const nuxtApp = useNuxtApp()
        if (nuxtApp.$i18n && nuxtApp.$i18n.messages) {
            return nuxtApp.$i18n.messages.value as NonNullable<UseI18nOptions['messages']>
        }
        if (import.meta.client) {
            const { messages } = useI18n()
            return messages.value as NonNullable<UseI18nOptions['messages']>
        }
        return {
            en: {},
        } as NonNullable<UseI18nOptions['messages']>
    }
    catch (error) {
        console.warn('Failed to get messages, using fallback:', error)
        return {
            en: {},
        } as NonNullable<UseI18nOptions['messages']>
    }
}

// 定义翻译消息的类型结构
interface TranslationMessages {
    [locale: string]: {
        [namespace: string]: Record<string, unknown>
    }
}

// 定义 glob 模块的类型（已弃用，保留用于向后兼容）
// interface GlobModules {
//   [path: string]: Record<string, unknown>
// }

// 定义配置名称类型，基于 i18nImportMap 的模块名称，排除 common
type ConfigName = Exclude<keyof (typeof i18nImportMap)[keyof typeof i18nImportMap], 'common'> | Array<Exclude<keyof (typeof i18nImportMap)[keyof typeof i18nImportMap], 'common'>>

// 定义 useLang 的 options 配置
interface UseLangOptions {
    // 是否立即将消息注入到全局 i18n 实例
    immediate?: boolean
}

const getLangMessages = (configName: ConfigName) => {
    const locale = getI18nLocale() as keyof typeof i18nImportMap
    const defaultLocale: keyof typeof i18nImportMap = 'en'
    let useLocaleMap = i18nImportMap[locale]
    let useLocale: keyof typeof i18nImportMap = locale
    if (!useLocaleMap) {
        useLocale = defaultLocale
        useLocaleMap = i18nImportMap[defaultLocale]
        console.warn(`No messages found for locale: ${locale}. Falling back to ${defaultLocale}.`)
    }

    // 🎯 标准化配置名称为数组格式
    const configNames = Array.isArray(configName) ? configName : [configName]

    // 🎯 动态获取所有可用语言，而不是硬编码
    const availableMessages = getAvailableMessages()
    const messages: TranslationMessages = {}

    // 为每个发现的语言初始化空对象
    Object.keys(availableMessages).forEach(lang => {
        messages[lang] = lang === useLocale
            ? availableMessages[
                lang as unknown as keyof typeof availableMessages
            ] as TranslationMessages[string]
            : {}
    })
    if (!messages[useLocale]) {
        messages[useLocale] = {}
    }

    configNames.forEach(configNameItem => {
        if (useLocaleMap?.[configNameItem]) {
            messages[useLocale][configNameItem] = {
                ...messages[useLocale][configNameItem],
                ...useLocaleMap[configNameItem](),
            }
        }
    })
    return messages
}

/**
 * 主要的 i18n 配置函数
 */
export function useLang(configName: ConfigName, options?: UseLangOptions): UseI18nOptions {
    const messages = getLangMessages(configName)

    const nuxtApp = useNuxtApp()

    // 抽离的消息重新注入函数
    const reloadMessages = (locale: string) => {
        const newMessages = getLangMessages(configName)
        if (newMessages && newMessages[locale]) {
            nuxtApp.$i18n.setLocaleMessage(locale, newMessages[locale])
        }
    }
    // 立即将消息注入到全局 i18n 实例（如果设置了 immediate 选项）
    if (options?.immediate) {
        const currentLocale = nuxtApp.$i18n.locale.value
        reloadMessages(currentLocale)
    }
    if (import.meta.client) {
        // 1. 监听语言切换
        watch(() => nuxtApp.$i18n.locale.value, newLocale => {
            reloadMessages(newLocale)
        })

        // 2. 监听 HMR 热更新
        if (import.meta.hot) {
            // 2.1 监听当前模块（i18nImportMap）的更新
            import.meta.hot.accept(() => {
                const currentLocale = nuxtApp.$i18n.locale.value
                reloadMessages(currentLocale)
            })
            // 2.2 监听自定义 i18n-update 事件
            import.meta.hot.on('i18n-update', async data => {
                const { locale, namespace } = data
                if (locale && namespace) {
                    const currentLocale = nuxtApp.$i18n.locale.value
                    reloadMessages(currentLocale)
                }
            })
        }
    }

    return {
        messages: messages as UseI18nOptions['messages'],
        useScope: 'global',
    }
}

export default useLang
