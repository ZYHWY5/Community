import { EventSource } from 'eventsource'
import { nanoid } from 'nanoid'
import { taskAbortManager } from '~/utils/taskAbortManager'
import { getAuthHeaders } from '~/api/index'
import useConst from '~/composables/useConst'

const baseConst = useConst()
export enum SSEMessageTypeEnum {
    Heartbeat = 'heartbeat',
    StateSync = 'state_sync',
    End = 'end',
    Connected = 'connected',
    Replay = 'replay',
    Message = 'message',
    Waiting = 'waiting',
}
export interface SSEOptions<T = any> {
    url: string
    method?: 'GET' | 'POST'
    headers?: Record<string, string>
    data?: Record<string, any> // GET 作为 query，POST 作为 body
    onMessage?: (data: T, event: MessageEvent, type: SSEMessageTypeEnum) => void // 结构化数据
    onError?: (event: Event & { code?: number, message?: string }) => void
    onOpen?: (event: Event) => void
    onClose?: () => void
    events?: string[] // 需要监听的自定义事件类型
    needAuth?: boolean // 是否自动合并 agent 认证头
    onEnd?: () => void
}

export class SSEClient<T = any> {
    private es: EventSource | null = null
    private options: SSEOptions<T>
    private reconnectTimer: NodeJS.Timeout | null = null
    private isClosed = false
    private messageListeners: Array<(data: T, event: MessageEvent, type: SSEMessageTypeEnum) => void> = []
    private endListeners: Array<() => void> = []
    private errorListeners: Array<(err: any) => void> = []
    private closeListeners: Array<() => void> = []

    constructor(options: SSEOptions<T>) {
        this.options = options
        this.connect()
    }

    private connect() {
        const {
            url: rawUrl,
            method = 'GET',
            headers,
            data,
            onMessage,
            onError,
            onOpen,
            events,
            needAuth,
            onEnd,
        } = this.options
        let url = rawUrl

        // GET: data 作为 query
        if (method === 'GET' && data) {
            const params = new URLSearchParams(data).toString()
            url += (url.includes('?') ? '&' : '?') + params
        }

        // 合并 agent 认证头
        const mergedHeaders = { ...headers }
        if (needAuth) {
            const agentHeaders = getAuthHeaders(url)
            // 过滤掉 undefined 字段，保证类型安全
            Object.entries(agentHeaders).forEach(([k, v]) => {
                if (typeof v === 'string' && v) {
                    mergedHeaders[k] = v
                }
            })
        }

        this.es = new EventSource(baseConst.baseUrl + url, {
            fetch: (input, init) => {
                const fetchOptions: RequestInit = {
                    ...init,
                    method,
                    headers: {
                        ...init?.headers,
                        ...mergedHeaders,
                    },
                }
                // POST: data 作为 body
                if (method === 'POST' && data) {
                    fetchOptions.body
                        = typeof data === 'string' ? data : JSON.stringify(data)
                }
                return fetch(input, fetchOptions)
            },
        })

        this.isClosed = false
        const handleOnMessage = (e: MessageEvent, type: SSEMessageTypeEnum) => {
            try {
                const parsed = JSON.parse(e.data || '{}') as T
                // code 52000 表示SSE通道的心跳消息，需要忽略
                // 后面更新了标准，推送heartbeat事件作为心跳，code的判断作为兼容机制保留
                if (isEmptyObject(parsed) || String((parsed as any).code) === '52000') {
                    return
                }
                onMessage && onMessage(parsed, e, type)
                this.messageListeners.forEach(cb => cb(parsed, e, type))
            }
            catch {
                // 可选：统一异常处理、日志、上报
                if (onError) {
                    onError({ ...(e as any), code: 500, message: 'JSON 解析失败' })
                }
            }
        }
        if (onOpen) this.es.addEventListener('open', onOpen)
        this.es.addEventListener(SSEMessageTypeEnum.Message, (e: MessageEvent) => handleOnMessage(e, SSEMessageTypeEnum.Message))
        this.es.addEventListener(SSEMessageTypeEnum.Waiting, (e: MessageEvent) => handleOnMessage(e, SSEMessageTypeEnum.Waiting))
        this.es.addEventListener('error', (e: any) => {
            console.log('SSE-error', e)
            if (this.isClosed) return
            // let needReconnect = !this.isClosed
            let needReconnect = false
            // error
            // {
            //     "content": "今天的成都是阴",//增量文本段，需要拼接，支持mdg格式
            //     "code":51001,//
            //     "need_retry":true//true需要重试，false不需要
            // }
            if (e.data) {
                const data = JSON.parse(e.data)
                if (data.need_retry) {
                    needReconnect = true
                }
            }
            if (needReconnect) {
                this.reconnect()
            }
            else {
                this.close()
                onError && onError(e)
                this.errorListeners.forEach(cb => cb(e))
            }
        })
        if (events && Array.isArray(events)) {
            events.forEach(eventType => {
                this.es!.addEventListener(eventType, (e: MessageEvent) => handleOnMessage(e, eventType as SSEMessageTypeEnum))
            })
        }
        this.es.addEventListener('end', () => {
            this.close()
            this.endListeners.forEach(cb => cb())
            onEnd && onEnd()
        })
    }

    private reconnect() {
        this.close()
        this.reconnectTimer = setTimeout(() => {
            this.connect()
        }, 2000)
    }

    /**
   * 关闭连接，支持链式调用
   */
    public close(): this {
        this.isClosed = true
        if (this.es) {
            this.es.close()
            this.es = null
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
        this.options.onClose?.()
        this.closeListeners.forEach(cb => cb())
        return this
    }

    /**
   * 注册结构化消息监听，支持多次注册和链式调用
   */
    public onMessage(cb: (data: T, event: MessageEvent, type: SSEMessageTypeEnum) => void): this {
        this.messageListeners.push(cb)
        return this
    }

    public onClose(cb: () => void): this {
        this.closeListeners.push(cb)
        return this
    }

    public onEnd(cb: () => void): this {
        this.endListeners.push(cb)
        return this
    }

    public onError(cb: (err: any) => void): this {
        this.errorListeners.push(cb)
        return this
    }
}

/**
 * @description 极简 SSE 封装，自动处理事件、类型安全、异常、认证等
 * @param {Omit<SSEOptions<T>, 'onMessage'> & { onData: (data: T) => void }} options
 * @returns {SSEClient<T>} SSE 客户端实例
 * @example
 * wrapSSE({
 *   url: '/api/stream',
 *   method: 'POST',
 *   data: { prompt, session_id },
 *   needAuth: true,
 *   onData: (msg) => { ... },
 *   onError: (e) => { ... }
 * })
 */
export function wrapSSE<T = any>(
    options: Omit<SSEOptions<T>, 'onMessage'> & {
        onData?: (data: T) => void
        onEnd?: () => void
        onClose?: () => void
        onError?: (err: any) => void
        timeout?: number // 毫秒
        onTimeout?: () => void
    },
): { client: SSEClient<T>, promise: () => Promise<T[]> } {
    // const { onData, timeout = 30000, onTimeout, ...rest } = options;
    const { onData, onTimeout, ...rest } = options
    const timer: ReturnType<typeof setTimeout> | null = null
    let resolvePromise: (value: T[]) => void
    let rejectPromise: (reason?: any) => void
    let settled = false
    const result: T[] = []

    // 超时处理函数
    // const resetTimeout = () => {
    //     if (timer) clearTimeout(timer)
    //     timer = setTimeout(() => {
    //         if (!settled) {
    //             settled = true
    //             onTimeout?.()
    //             rejectPromise(new Error('SSE timeout'))
    //             client.close()
    //         }
    //     }, timeout)
    // }

    const client = new SSEClient<T>({
        ...rest,
        onMessage: (data, _event) => {
            onData && onData(data)
            result.push(data)
            // resetTimeout()
        },
        onEnd: () => {
            if (timer) clearTimeout(timer)
            if (!settled) {
                settled = true
                resolvePromise(result)
            }
            rest.onEnd?.()
        },
        onError: err => {
            if (timer) clearTimeout(timer)
            if (!settled) {
                settled = true
                rejectPromise(err)
            }
            rest.onError?.(err)
        },
        onClose: () => {
            if (timer) clearTimeout(timer)
            if (!settled) {
                settled = true
                resolvePromise(result) // 主动关闭时 resolve
            }
            rest.onClose?.()
        },
    })

    // resetTimeout()

    function promise() {
        return new Promise<T[]>((resolve, reject) => {
            resolvePromise = resolve
            rejectPromise = reject
        })
    }

    return { client, promise }
}

export function wrapSSEWithAbort<T = any>(
    options: Parameters<typeof wrapSSE<T>>[0],
) {
    const { client, promise } = wrapSSE<T>(options)
    const taskId = nanoid()
    taskAbortManager.register(taskId, () => client.close())
    const abort = () => taskAbortManager.abort(taskId)
    return { taskId, client, promise, abort }
}

// 用法示例：
// const sse = new SSEClient({
//   url: 'http://localhost:3000/sse',
//   headers: { Authorization: 'Bearer xxx' },
//   onMessage: (e) => { console.log(e.data) },
//   onError: (e) => { console.error(e) },
//   onOpen: () => { console.log('SSE connected') },
//   onClose: () => { console.log('SSE closed') },
//   events: ['notice', 'update'],
// })
// sse.close()
