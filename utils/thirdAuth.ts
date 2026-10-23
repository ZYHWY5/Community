/**
 * 三方授权重定向工具
 * 提供安全的 URL 重定向功能,支持白名单验证
 */

/**
 * 三方授权 URL 参数接口
 */
export interface ThirdAuthUrlParams {
    /** 用户 token (必传,将作为 ima_token 参数注入 URL) */
    token: string
    /** 其他需要注入到 URL 的查询参数 */
    [key: string]: string
}

/**
 * 三方授权重定向,安全地打开外部授权 URL
 * 内部自动从 useConst 获取白名单验证
 *
 * @param url - 目标授权 URL 字符串
 * @param params - URL 参数对象,token 必传,其他参数可选
 * @param target - window.open 的 target 参数,默认 '_blank'
 * @returns window.open 返回的 Window 对象或 null
 * @throws 当 URL 无效或域名不在白名单中时抛出错误
 *
 * @example
 * ```typescript
 * // 在新窗口打开授权链接,只传 token
 * openThirdAuthUrl('https://example.com/auth', { token: userToken })
 *
 * // 在当前窗口打开,传入额外参数
 * openThirdAuthUrl('https://example.com/auth', {
 *   token: userToken,
 *   userId: '123',
 *   source: 'web'
 * }, '_self')
 * ```
 */
export function openThirdAuthUrl(
    url: string,
    params: ThirdAuthUrlParams,
    target: string = '_blank',
): Window | null {
    try {
        // 解析 URL
        const urlObj = new URL(url)

        // 获取白名单配置
        const { thirdAuthDomain } = useConst()

        // 验证域名是否在白名单中
        const isAllowed = thirdAuthDomain.some((domain: string) =>
            urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
        )

        if (!isAllowed) {
            const error = new Error(
                `[Third Auth] Domain not allowed: ${urlObj.hostname}. Allowed domains: ${thirdAuthDomain.join(', ')}`,
            )
            console.error(error.message)
            throw error
        }

        // 注入 token 参数 (使用 ima_token 作为 key)
        urlObj.searchParams.set('ima_token', params.token)

        // 注入其他参数
        Object.keys(params).forEach(key => {
            if (key !== 'token') {
                urlObj.searchParams.set(key, params[key])
            }
        })

        // 打开链接
        const redirectUrl = urlObj.toString()
        const windowRef = window.open(redirectUrl, target)

        return windowRef
    }
    catch (error) {
        // URL 格式无效或其他错误
        if (error instanceof TypeError) {
            const urlError = new Error(`[Third Auth] Invalid URL format: ${url}`)
            console.error(urlError.message, error)
            throw urlError
        }
        // 重新抛出其他错误
        throw error
    }
}
