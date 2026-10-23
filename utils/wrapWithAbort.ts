import { nanoid } from 'nanoid'
import { taskAbortManager } from './taskAbortManager'

/**
 * 高阶函数：为任意Promise风格的请求函数增加中断能力，支持泛型透传
 */
export function wrapWithAbort<F extends (...args: any[]) => Promise<any>>(
    fn: F,
) {
    return function <T = any>(
        ...args: Parameters<F>
    ): {
        taskId: string
        promise: Promise<T>
        abort: () => void
    } {
        const controller = new AbortController()
        const taskId = nanoid()
        // 处理config参数（最后一个参数为对象时注入signal，否则补充）
        const configIdx = args.length - 1
        if (typeof args[configIdx] !== 'object' || args[configIdx] === null) {
            args.push({ signal: controller.signal })
        }
        else {
            args[configIdx] = { ...args[configIdx], signal: controller.signal }
        }
        taskAbortManager.register(taskId, () => controller.abort())
        // 保证返回类型为Promise<T>
        const promise = fn(...args) as Promise<T>
        const wrapped = promise.finally(() => taskAbortManager.unregister(taskId))
        const abort = () => taskAbortManager.abort(taskId)
        return { taskId, promise: wrapped, abort }
    }
}
