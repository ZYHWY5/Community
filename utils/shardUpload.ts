import type { GenerateUploadInfoParams, GetWCSUploadTokenData } from '~/types/imKit'
import type { UploadObject, ExtraConfig } from 'wcs-js-sdk'
import { generateUploadInfo } from '~/api/imKit'
import { httpToHttps, getFileMediaType } from '~/utils/index'
import { useConfirm } from '~/composables/useConfirm'
import { useToast } from '~/composables/useToast'

/**
 * WCS 上传进度信息（内部使用）
 */
type WCSProgress = {
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
 * 获取 WCS 上传 Token（用于分片上传）
 * @param params 上传参数，格式与 GenerateUploadInfoParams 相同
 * @returns Promise<GetWCSUploadTokenData> 包含 token、upload_url、key、fdl 等上传所需信息
 */
export async function getWCSUploadTokenForShard(params: GenerateUploadInfoParams): Promise<GetWCSUploadTokenData> {
    // 使用 generateUploadInfo，传入 plat: 'wcs' 来获取 WCS 上传凭证
    const response = await generateUploadInfo({
        ...params,
        plat: 'wcs',
    }) as GetWCSUploadTokenData

    return response
}

/**
 * 使用 WCS 分片上传文件
 * @param uid 用户 ID
 * @param file 要上传的文件
 * @param type 文件类型（可选，如果不提供则根据文件自动推断）
 * @param onProgress 进度回调函数（可选），接收 0-100 的百分比数字
 * @returns Promise<string> 返回上传完成后的文件下载链接（fdl），已转换为 https 协议
 */
export async function uploadFileWithShard(
    uid: string,
    file: File,
    type?: 'video' | 'image' | 'audio',
    onProgress?: (progress: number) => void,
): Promise<string> {
    // 确保只在客户端执行
    if (!import.meta.client) {
        throw new Error('uploadFileWithShard 只能在客户端使用')
    }

    // 动态导入 wcs-js-sdk，只在客户端需要时才加载
    const wcsJsSdk = await import('wcs-js-sdk')
    // 处理 CommonJS 和 ESM 两种导出方式
    const wcsUpload = (wcsJsSdk.default?.wcsUpload || (wcsJsSdk as any).wcsUpload) as (
        file: File,
        token: string,
        uploadUrl: string,
        extraConfig?: ExtraConfig,
    ) => UploadObject

    const nuxtApp = useNuxtApp()
    const { t: $t } = nuxtApp.$i18n
    // 如果未提供 type，则根据文件自动推断
    const fileType = type || getFileMediaType(file)
    if (!fileType) {
        throw new Error('无法识别文件类型，请手动指定 type 参数')
    }

    // 获取文件后缀
    const suffix = file.name.split('.').pop() || ''

    // 获取上传凭证
    const tokenData = await getWCSUploadTokenForShard({
        uid,
        type: fileType,
        suffix,
    })

    // 创建 Promise 来封装回调模式
    return new Promise<string>((resolve, reject) => {
        // 创建 WCS 上传对象
        const uploadObj = wcsUpload(
            file,
            tokenData.token,
            tokenData.upload_url,
            {
                timeout: 30000, // 单个分片上传超时时间：30 秒（超时错误可以重试）
                concurrentRequestLimit: 5, // 并发数
                retryCount: 5, // 重试次数：每个分片失败后自动重试 5 次
                key: tokenData.key, // 文件唯一标识符
                mimeType: file.type, // MIME 类型
            },
        )

        // 设置进度回调，将 WCS 进度对象转换为百分比数字（整数 0-100）
        uploadObj.uploadProgress = (progress: WCSProgress) => {
            // 提取总进度百分比（0-100），确保返回整数
            let percent = 0
            if (progress.total?.percent !== undefined) {
                // 如果 SDK 提供了 percent，直接使用并四舍五入
                percent = Math.round(progress.total.percent)
            }
            else if (progress.total?.size && progress.total.size > 0) {
                // 否则根据 loaded 和 size 计算
                percent = Math.round((progress.total.loaded / progress.total.size) * 100)
            }
            // 确保范围在 0-100 之间
            percent = Math.max(0, Math.min(100, percent))
            onProgress?.(percent)
        }

        // 设置错误回调
        uploadObj.onError = (error: { code?: number, message: string, isRequestError?: boolean }) => {
            // 如果是请求错误（服务端返回的错误），不需要重试
            // if (error.isRequestError) {
            //     reject(new Error(error.message || '上传失败：服务端返回错误'))
            // }
            // else {
            //     // 网络错误或其他错误，可以重试
            //     reject(new Error(error.message || '上传失败：网络错误'))
            // }
            const toast = useToast()
            useConfirm({
                title: $t('common.upload.failed'),
                desc: $t('common.upload.desc'),
                okText: $t('common.upload.retry'),
                onOk: () => {
                    uploadObj.putFile()
                },
                onCancel: () => {
                    reject(new Error(error.message || $t('common.upload.networkError')))
                },
            })
            toast.error(error.message)
        }

        // 设置完成回调
        uploadObj.onComplete = () => {
            // 上传完成后，返回 fdl 链接（经过 httpToHttps 转换）
            resolve(httpToHttps(tokenData.fdl))
        }

        // 开始上传
        uploadObj.putFile()
    })
}
