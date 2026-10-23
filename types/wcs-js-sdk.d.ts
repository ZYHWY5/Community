/**
 * WCS JS SDK 类型声明
 * 网宿云存储 JavaScript SDK 的类型定义
 */
declare module 'wcs-js-sdk' {
    /**
     * WCS 上传额外配置选项
     */
    export interface ExtraConfig {
        /** 超时毫秒数，默认为 0（不超时），超时错误可以重试上传 */
        timeout?: number
        /** 并发数，默认为 3。注：浏览器对连接的请求资源是有限的，比如 Chrome 的请求资源是 6 */
        concurrentRequestLimit?: number
        /** 上传重试次数，默认为 0 */
        retryCount?: number
        /** 选填，用于指定文件上传至云存储的名称，注：token 中指定的 key 优先级较高 */
        key?: string
        /** 选填，自定义文件的 MIME-Type */
        mimeType?: string
        /** 选填，文件保存期限。超过保存天数文件自动删除，单位：天。例如：1、2、3 */
        deadline?: number
        /** 选填，文件上传块大小设置。默认 4M，如需修改请填写 4 的倍数，单位：M。如 8、12、16 */
        blockSize?: number
    }

    /**
     * WCS 上传进度信息
     */
    export interface WCSProgressInfo {
        total: {
            loaded: number
            size: number
            percent: number
        }
        chunks: Array<{
            loaded: number
            size: number
            percent: number
        }>
    }

    /**
     * WCS 上传错误信息
     */
    export interface WCSError {
        code?: number
        message: string
        isRequestError?: boolean
    }

    /**
     * WCS 上传完成响应
     */
    export interface WCSCompleteResponse {
        data: string | object
    }

    /**
     * WCS 上传对象
     */
    export interface UploadObject {
        /** 开始上传 */
        putFile(): void
        /** 停止上传 */
        stop(): void
        /** 上传进度回调 */
        uploadProgress?: (progress: WCSProgressInfo) => void
        /** 错误回调 */
        onError?: (error: WCSError) => void
        /** 完成回调 */
        onComplete?: (res: WCSCompleteResponse) => void
    }

    /**
     * WCS 上传函数
     * @param file 要上传的文件
     * @param token 后台服务器获取的 token
     * @param uploadUrl 网宿云存储分配的上传地址
     * @param extraConfig 额外配置选项
     * @returns 上传对象，可用于控制上传行为
     */
    export function wcsUpload(
        file: File,
        token: string,
        uploadUrl: string,
        extraConfig?: ExtraConfig,
    ): UploadObject

    /**
     * URL Safe Base64 解码
     * @param encodedString 编码后的字符串
     * @returns 解码后的字符串
     */
    export function URLSafeBase64Decode(encodedString: string): string

    /**
     * 获取文件 etag
     * @param file 文件对象
     * @param callback 回调函数，接收 etag 值
     */
    export function getEtagHash(file: File, callback: (etag: string) => void): void

    /**
     * 默认导出，包含所有导出的函数和类型
     */
    const wcsJsSdk: {
        wcsUpload: typeof wcsUpload
        URLSafeBase64Decode: typeof URLSafeBase64Decode
        getEtagHash: typeof getEtagHash
    }

    export default wcsJsSdk
}
