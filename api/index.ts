import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
// 假设baseConst和useUserStore已在项目中实现
import { nanoid } from 'nanoid'
import useConst from '~/composables/useConst'
import { usePlayerUserStore } from '~/stores/player-user'
import { useLogin } from '~/components/common/player-login/useLogin'
import { useToast } from '~/composables/useToast'
import { wrapWithAbort } from '~/utils/wrapWithAbort'
import { getI18nLocale } from '~/composables/useLang'

const baseConst = useConst()
const toast = useToast()

// const trackFetch = (config: AxiosRequestConfig, trackType?: 'request' | 'response', response?: AxiosResponse) => {
//     try {
//         const { $sensors } = useNuxtApp()
//         const useHeaders = {
//             Authorization: config.headers?.Authorization,
//             app_uid: config.headers?.app_uid,
//             app_id: config.headers?.app_id,
//             x_app_request_id: config.headers?.x_app_request_id,
//             x_app_language: config.headers?.x_app_language,
//             ima_token: config.headers?.ima_token,
//         }
//         const useResponse = {
//             status: response?.status,
//             code: response?.data?.code,
//             message: response?.data?.message,
//         }
//         $sensors.track('kewlweb_fetch', {
//             url: config.url,
//             method: config.method,
//             data: config.data,
//             params: config.params,
//             headers: JSON.stringify(useHeaders),
//             trackType,
//             response: JSON.stringify(useResponse),
//         })
//     }
//     catch (error) {
//         console.warn('trackFetch error', error)
//     }
// }
// 获取 i18n 翻译函数的辅助函数
function getI18nMessage(key: string): string {
    try {
        if (!import.meta.client) {
            throw new Error('getI18nMessage can only be called on the client side')
        }
        if (!useNuxtApp) {
            throw new Error('useNuxtApp is not available')
        }
        const { $i18n } = useNuxtApp()
        if (!$i18n) {
            throw new Error('i18n is not available')
        }
        return $i18n.t(key)
    }
    catch {
        // Fallback 以防 $i18n 不可用
        const messages: Record<string, string> = {
            'common.api.requestFailed': 'Request failed',
            'common.api.authExpired': 'Authentication expired, please log in again!',
            'common.api.sessionTerminated': 'Session terminated, request canceled',
            'common.api.networkError': 'Network error, please try again later',
        }
        return messages[key] || key
    }
}

const ignoreToastAPI: string[] = [] // 你的接口白名单
const whiteListCode: (string | number)[] = [] // 你的状态码白名单

declare module 'axios' {
    export interface AxiosRequestConfig {
        authRequired?: boolean
    }
}

function getDefaultConfig() {
    return {
        globalParams: {
            h5: 1,
            alias: baseConst.alias,
            app: baseConst.alias,
        },
        /** 只有本地数据库,使用本地地址 */
        baseUrl: 'http://localhost:3001',
        headers: {
            'Content-Type': 'application/json',
        },
    }
}

export function getAuthParams() {
    const userStore = usePlayerUserStore()
    return {
        uid: userStore.userInfo.uid || undefined,
        tuid: userStore.userInfo.uid || undefined,
        token: userStore.userInfo.token || undefined,
        // area: userStore.userInfo.area || 'A_US',
        // country_code: userStore?.userInfo.countryCode || undefined,
    }
}
export function getAuthHeaders(url: string, isConfigApi: boolean = true) {
    const authParams = getAuthParams()
    const requestId = nanoid()
    const locale = getI18nLocale()
    const headers = isConfigApi
        ? {
            ima_token: authParams.token,
            app_uid: authParams.uid,
            Authorization: `Bearer ${baseConst.agentAppKey || ''}`,
            app_id: baseConst.agentAppID || '',
            x_app_request_id: requestId,
            x_app_language: locale,
        }
        : {}
    return headers
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
    baseURL: '', // 可根据实际情况调整
    timeout: 120 * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
})
// 请求拦截器
instance.interceptors.request.use(
    config => {
        const { globalParams, baseUrl, headers } = getDefaultConfig()
        // 只有authRequired为true时才加认证参数
        const needAuth = config.authRequired === true
        const authParams = needAuth ? getAuthParams() : {}
        const authHeaders = needAuth
            ? getAuthHeaders(config.url || '', !config.baseURL || config.baseURL === baseUrl)
            : {}

        // 合并headers
        config.headers = Object.assign({}, headers, authHeaders, config.headers)
        // baseUrl优先级：config.baseURL > getDefaultConfig.baseUrl
        config.baseURL = config.baseURL || baseUrl
        // 合并参数到query/body
        if (config.method === 'get') {
            config.params = {
                ...globalParams,
                ...authParams,
                ...(config.params || {}),
            }
        }
        else {
            if (typeof config.data === 'object' && config.data !== null) {
                if (import.meta.client && config.data instanceof FormData) {
                    // 追加 globalParams 和 authParams 到 FormData
                    Object.entries({ ...globalParams, ...authParams }).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && config.data.get(key) === undefined) {
                            config.data.append(key, value)
                        }
                    })
                }
                else {
                    config.data = { ...globalParams, ...authParams, ...config.data }
                }
            }
            else {
                config.data = { ...globalParams, ...authParams }
            }
        }
        // fix: 兼容服务器请求无法获取请求协议问题
        if (import.meta.server) {
            const _baseUrl = config.baseURL
            const _url = config.url
            if (_baseUrl?.startsWith('//')) {
                config.baseURL = `https:${_baseUrl}`
            }
            if (_url?.startsWith('//')) {
                config.url = `https:${_url}`
            }
        }
        return config
    },
    error => Promise.reject(error),
)

// 响应拦截器
instance.interceptors.response.use(
    response => {
        const data = response.data

        // 1. 成功响应
        if (
            response.status === 200
            && (data.status === 200 || data.status === '200' || data.code === 200 || data.code === 1)
        ) {
            return data.data
        }
        // 3. 其他错误，非白名单接口/状态码才 toast
        const isIgnore = ignoreToastAPI.some(cur => response.config.url?.includes(cur))
        const isWhiteCode = whiteListCode.includes(data.code)
        if (!isIgnore && !isWhiteCode) {
            toast.error(data.message || data.msg || getI18nMessage('common.api.requestFailed'))
        }
        return Promise.reject(data)
    },
    error => {
        // trackFetch(error.config, 'response', error.response)
        const status = error.status + ''
        if (status === '401' || status === '403') {
            if (import.meta.client) {
                useLogin().logout()
                usePlayerUserStore().openLoginDialog()
            }
            toast.error(getI18nMessage('common.api.authExpired'))
        }
        else {
            let errorMessage = ''
            if (error.code === 'ERR_CANCELED') {
                errorMessage = getI18nMessage('common.api.sessionTerminated')
            }
            else {
                errorMessage
                    = error.response?.data?.message
                      || error.response?.data?.msg
                      || error.message
                      || getI18nMessage('common.api.networkError')
            }
            toast.error(errorMessage)
        }
        return Promise.reject(error)
    },
)

/**
 * 在 Nuxt 上下文中执行 axios 请求
 * 如果 nuxtApp 可用，使用 runWithContext 包裹以确保拦截器有正确的 Nuxt 上下文
 * 否则直接执行回调
 */
function withNuxtContext<T>(fn: () => Promise<T>): Promise<T> {
    const nuxtApp = tryUseNuxtApp()
    return nuxtApp ? nuxtApp.runWithContext(fn) : fn()
}

// 通用请求方法，直接返回 data 字段，类型安全
export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return withNuxtContext(() => instance.get<T>(url, config) as Promise<T>)
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return withNuxtContext(() => instance.post<T>(url, data, config) as Promise<T>)
}

/**
 * 通用 request 方法，支持 axios 所有请求方法，类型安全，自动返回 data 字段
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return withNuxtContext(() => instance.request<T>(config) as Promise<T>)
}

export const requestWithAbort = wrapWithAbort(request)
export const postWithAbort = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    requestWithAbort<T>({ url, method: 'post', data, ...config })
export const getWithAbort = <T = any>(url: string, config?: AxiosRequestConfig) =>
    requestWithAbort<T>({ url, method: 'get', ...config })

export default {
    get,
    post,
    request,
    postWithAbort,
    getWithAbort,
    requestWithAbort,
}
