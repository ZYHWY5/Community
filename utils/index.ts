import type { Emitter } from 'mitt'

// 获取目标事件映射，支持 Window、HTMLElement、MediaQueryList
// MediaQueryListEventMap 适配
interface MediaQueryListEventMap {
    change: MediaQueryListEvent
}

type TargetEventMap<T> = T extends Window
    ? WindowEventMap
    : T extends HTMLElement
        ? HTMLElementEventMap
        : T extends MediaQueryList
            ? MediaQueryListEventMap
            : T extends Emitter<infer E>
                ? E // 使用 Mitt 的事件类型
                : Record<string, any> // 默认情况下使用通用的 Event 类型

// 从事件映射中提取特定事件的参数类型

type EventArgs<T, K extends keyof TargetEventMap<T>> = TargetEventMap<T>[K] extends any[]
    ? TargetEventMap<T>[K]
    : [TargetEventMap<T>[K]] // 确保返回一个数组或元组
// 自动推导的事件处理选项类型
interface EventHandlerOptions<T, K extends keyof TargetEventMap<T>> {
    target: T
    type: K
    listener: EventListenerFunc<T, K>
    options?: boolean | object
    advOptions?: {
        on: string
        off: string
    }
}
type EventListenerFunc<T, K extends keyof TargetEventMap<T>> = (...args: EventArgs<T, K>) => void

// 定义重载
export function useEventHandler<T, K extends keyof TargetEventMap<T>>(options: EventHandlerOptions<T, K>): () => void

// 定义重载，拆分参数
export function useEventHandler<T, K extends keyof TargetEventMap<T>>(
    target: T,
    type: K,
    listener: EventListenerFunc<T, K>,
    options?: boolean | object,
    advOptions?: {
        on: string
        off: string
    },
): () => void

// 实现函数
export function useEventHandler<T, K extends keyof TargetEventMap<T>>(
    a: EventHandlerOptions<T, K> | T,
    b?: K | EventListenerFunc<T, K>,
    c?: EventListenerFunc<T, K> | boolean | AddEventListenerOptions,
    d?: boolean | object,
    e?: {
        on: string
        off: string
    },
) {
    let target: T
    let type: K
    let listener: EventListenerFunc<T, K>
    let options: boolean | AddEventListenerOptions | undefined
    const advOptions: {
        on: string
        off: string
    } = {
        on: 'addEventListener',
        off: 'removeEventListener',
    }

    // 处理参数
    if (typeof a === 'object' && a !== null && 'target' in a) {
        // 使用选项对象
        target = a.target
        type = a.type
        listener = a.listener
        options = a.options
        if (a.advOptions && a.advOptions.on && a.advOptions.off) {
            advOptions.on = a.advOptions.on
            advOptions.off = a.advOptions.off
        }
    }
    else {
        // 拆分参数
        target = a
        type = b as K
        listener = c as EventListenerFunc<T, K>
        options = d
        if (e && e.on && e.off) {
            advOptions.on = e.on
            advOptions.off = e.off
        }
    }

    // 绑定事件

    (target as any)[advOptions.on](type as string, listener as EventListener, options)

    // 返回解绑函数
    return () => {
        (target as any)[advOptions.off](type as string, listener as EventListener, options)
    }
}

// 新增 useObserverEventHandler 函数
export function useObserverEventHandler<T, K extends keyof TargetEventMap<T>>(
    emitter: T,
    type: K,
    listener: EventListenerFunc<T, K>,
    options?: boolean | AddEventListenerOptions,
): () => void {
    return useEventHandler({
        target: emitter,
        type,
        listener,
        options,
        advOptions: {
            on: 'on',
            off: 'off',
        },
    })
}

// 新增 useMittEventHandler 函数
export function useMittEventHandler<T, K extends keyof TargetEventMap<T>>(
    emitter: T,
    type: K,
    listener: EventListenerFunc<T, K>,
    options?: boolean | AddEventListenerOptions,
): () => void {
    return useObserverEventHandler<T, K>(emitter, type, listener, options)
}

/**
 * 创建一个清理队列，用于管理一组清理函数
 * 当调用 cleanup 方法时，会依次执行队列中的所有清理函数
 * @returns {object} 包含 addCleanup 和 cleanup 方法的对象
 */
export function useCleanupQueue() {
    const cleanups: ((...args: any[]) => any)[] = []
    const cleanup = () => {
        cleanups.forEach(cleanup => {
            cleanup()
        })
        cleanups.length = 0
    }
    // cleanupFunc支持如下的传参方式
    // addCleanup(fun) | addCleanup([fun, fun...]) | addCleanup(fun, fun, fun ...)

    const addCleanup = (...cleanupFunc: ((...args: any[]) => any)[]) => {
        if (cleanupFunc.length === 0) {
            return
        }
        if (cleanupFunc.length === 1) {
            if (Array.isArray(cleanupFunc[0])) {
                cleanups.push(...cleanupFunc[0])
            }
            else {
                cleanups.push(cleanupFunc[0])
            }
        }
        else {
            cleanups.push(...cleanupFunc)
        }
    }
    return {
        addCleanup,
        cleanup,
    }
}

export function getQueryData(queryString: string) {
    queryString = queryString.replace(/^\?+/, '').replace(/&amp;/, '&')
    const querys = queryString.split('&')
    let i = querys.length
    const _URLParms: Record<string, any> = {}
    while (i--) {
        const item = querys[i].split('=')
        if (item[0]) {
            let value = item[1] || ''
            try {
                value = decodeURIComponent(value)
            }
            catch {
                value = unescape(value)
            }
            _URLParms[decodeURIComponent(item[0])] = value
        }
    }
    return _URLParms
}

export function getFileMediaType(file: File) {
    const mimeType = file.type
    const fileName = file.name

    if (mimeType.startsWith('image/')) {
        return 'image'
    }
    else if (mimeType.startsWith('video/')) {
        return 'video'
    }
    else if (mimeType.startsWith('audio/')) {
        return 'audio'
    }
    else {
        // 通过文件名扩展名兜底判断
        const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov']
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a']

        if (imageExtensions.includes(ext)) {
            return 'image'
        }
        else if (videoExtensions.includes(ext)) {
            return 'video'
        }
        else if (audioExtensions.includes(ext)) {
            return 'audio'
        }
        return undefined
    }
}
// 下载图片
export function downloadFile(url: string) {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = getFileNameFromURL(url) // 可选：指定下载文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export function getFileNameFromURL(url: string): string {
    return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1))
}

// 改进的下载文件函数
// 改进的下载文件函数 - 支持文件夹选择API，优雅回退
export function downloadFileImproved(url: string, filename?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        // SSR兼容性检查
        if (!import.meta.client) {
            reject(new Error('文件下载仅在客户端环境下可用'))
            return
        }

        try {
            const urlObj = new URL(url)
            let useFetchDownload = true
            const timestampHost = ['img.linkv.fun', 'zhubite-imagent-bot', 'mesx.emolm.com']
            for (const cur of timestampHost) {
                if (urlObj.hostname.startsWith(cur)) {
                    urlObj.searchParams.set('timestamp', Date.now().toString())
                    break
                }
            }
            const downloadHost = ['ima.esxscloud.com', 'ima-ga.esxscloud.com']
            for (const cur of downloadHost) {
                if (urlObj.hostname.startsWith(cur)) {
                    urlObj.pathname = '/download' + urlObj.pathname
                    useFetchDownload = false
                    break
                }
            }
            const useUrl = urlObj.toString()
            let objectUrl = useUrl
            if (useFetchDownload) {
                const response = await fetch(useUrl)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }
                // 转换为 Blob
                const blob = await response.blob()
                objectUrl = URL.createObjectURL(blob)
            }

            const suggestedFilename = filename || getImprovedFileNameFromURL(useUrl)

            // 检查是否支持 File System Access API
            // if ('showSaveFilePicker' in window) {
            //     try {
            //         // 显示保存文件对话框 - 使用MDN推荐的简单方式
            //         const fileHandle = await (window as any).showSaveFilePicker({
            //             suggestedName: suggestedFilename,
            //         })

            //         // 创建可写流并写入文件
            //         const writable = await fileHandle.createWritable()
            //         await writable.write(blob)
            //         await writable.close()

            //         resolve()
            //         return
            //     }
            //     catch (pickerError) {
            //         // 用户取消选择时静默处理，其他错误输出警告
            //         if ((pickerError as Error).name !== 'AbortError') {
            //             console.warn('文件选择器失败，回退到传统下载:', pickerError)
            //         }
            //     }
            // }

            // 回退方案：传统的blob URL下载
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = objectUrl
            link.download = suggestedFilename

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(objectUrl)

            resolve()
        }
        catch (error) {
            reject(error)
        }
    })
}

// 改进的文件名提取函数
export function getImprovedFileNameFromURL(url: string): string {
    try {
        // 创建URL对象来正确解析
        const urlObj = new URL(url)
        let pathname = urlObj.pathname

        // 移除路径前的斜杠
        if (pathname.startsWith('/')) {
            pathname = pathname.substring(1)
        }

        // 获取最后一个路径段
        const segments = pathname.split('/')
        let filename = segments[segments.length - 1]

        // 如果没有文件名，使用默认名
        if (!filename || filename === '') {
            filename = 'download'
        }

        // 解码URL编码的字符
        filename = decodeURIComponent(filename)

        // 清理文件名中的特殊字符
        filename = filename.replace(/[<>:"/\\|?*]/g, '_')

        return filename
    }
    catch {
        // 如果URL解析失败，回退到原来的方法
        const fallback = url.substring(url.lastIndexOf('/') + 1)
        return fallback || 'download'
    }
}

// Nuxt兼容的下载函数
export function downloadFileNuxt(url: string, filename?: string): Promise<void> {
    // 在Nuxt中使用
    if (import.meta.client) {
        return downloadFileImproved(url, filename)
    }
    else {
        return Promise.reject(new Error('文件下载仅在客户端环境下可用'))
    }
}

export const isEmptyObject = <T = any>(obj: T): boolean => {
    for (const key in obj) {
        return false
    }
    return true
}

/**
 * @description 将数字格式化为紧凑型带单位的显示格式
 * @param value - 要格式化的数值，支持 number 或 string 类型
 * @param precision - 保留的小数位数，默认为 2
 * @returns {string} 格式化后的字符串，如 "50.00k", "100.00w", "1.20E", "9999"
 * @example
 * formatCompactNumber(9999) // "9999"
 * formatCompactNumber(50000) // "50.00k"
 * formatCompactNumber(5000000) // "500.00w"
 * formatCompactNumber(50000000) // "5.00E"
 * formatCompactNumber(500, 0) // "500"
 */
export const formatCompactNumber = (value: number | string, precision: number = 2): string => {
    // 处理字符串输入，转换为数字
    const num = typeof value === 'string' ? parseFloat(value) : value

    // 处理无效输入
    if (isNaN(num) || num < 0) return '0'

    // 处理精度参数
    const validPrecision = Math.max(0, Math.min(precision, 10)) // 限制在0-10之间

    // 1千万（10,000,000）以上 - 使用 E 表示
    if (num >= 10000000) {
        const divisor = 100000000
        const multiplier = Math.pow(10, validPrecision)
        const formatted = (Math.floor((num / divisor) * multiplier) / multiplier).toFixed(validPrecision)
        return `${formatted}E`
    }

    // 100万到1千万之间使用 w（万）
    if (num >= 1000000) {
        const divisor = 10000
        const multiplier = Math.pow(10, validPrecision)
        const formatted = (Math.floor((num / divisor) * multiplier) / multiplier).toFixed(validPrecision)
        return `${formatted}w`
    }

    // 1万到100万之间使用 k（千）
    if (num >= 10000) {
        const divisor = 1000
        const multiplier = Math.pow(10, validPrecision)
        const formatted = (Math.floor((num / divisor) * multiplier) / multiplier).toFixed(validPrecision)
        return `${formatted}k`
    }

    // 小于1万直接返回字符串
    return Math.floor(num).toString()
}

/**
 * 获取url参数
 */
export const getUrlParamByKey = (search: Location['search'], key: string) => {
    if (!search) {
        return ''
    }
    const params = new URLSearchParams(search)
    return params.get(key)
}
/**
 * 获取粘贴板的文件
 * @param event
 * @returns
 */
export const getPasteFiles = (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData
    if (!clipboardData) return []

    const items = Array.from(clipboardData.items)
    const files: File[] = []
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile()
            if (file) {
                files.push(file)
            }
        }
    }
    return files
}

/**
 * 防抖函数
 * 执行机制：等待一段时间，如果在这段时间内函数被再次调用，则重新计时
 * 执行时机：最后一次触发后，等待一段时间再执行
 * 应用场景：适合处理"单次动作"的场景
 * @param func 函数
 * @param duration 间隔时间
 * @returns 返回一个函数
 */
export const debounce = (func: (...args: any[]) => any, duration: number = 300) => {
    let timeout: number | null = null
    return (...args: any[]) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => func(...args), duration) as unknown as number
    }
}
/**
 * 节流函数
 * 执行机制：固定间隔，在指定时间内最多执行一次
 * 执行时机：按固定频率执行，无论触发多少次
 * 应用场景：适合处理"持续动作"的场景
 * @param func 函数
 * @param duration 间隔时间
 * @returns 返回一个函数
 */
export const throttle = (func: (...args: any[]) => any, duration: number = 300) => {
    let timeout: number | null = null
    return (...args: any[]) => {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null
                func(...args)
            }, duration) as unknown as number
        }
    }
}

// 手机号 密码验证
export function validateString(value: string, type: string) {
    const validateConfig: Record<
        string,
        {
            pattern: string
        }
    > = {
        email: {
            pattern:
        '^[0-9a-zA-Z]+([-_.]*[A-Za-z0-9]+)*[_]*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$',
        },
        password: {
            pattern: '^.{6,20}$',
        },
        phone: {
            pattern: '^[0-9]*$',
        },
        name: {
            pattern: '^[A-Za-z0-9\u4E00-\u9FA5]+$',
        },
    }
    if (new RegExp(validateConfig[type].pattern).test(value)) {
        return true
    }
    return false
}

/**
 * @description 将 http 协议的 URL 替换为 https 协议
 * @param url - 要转换的 URL 字符串
 * @returns {string} 转换后的 URL，如果原本是 http 则替换为 https，否则保持不变
 * @example
 * httpToHttps('http://example.com') // "https://example.com"
 * httpToHttps('https://example.com') // "https://example.com"
 * httpToHttps('ftp://example.com') // "ftp://example.com"
 */
export function httpToHttps(url: string): string {
    if (!url || typeof url !== 'string') {
        return url
    }
    return url.replace(/^http:\/\//i, 'https://')
}
