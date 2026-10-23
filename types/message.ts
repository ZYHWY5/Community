import type { MessageChatNode } from '~/composables/useIMKit/types'

export enum UseType {
    toTalk = 'toTalk',
    like = 'like',
    dislike = 'dislike',
    cancelLike = 'cancelLike',
    cancelDislike = 'cancelDislike',
    download = 'download',
    allToTalk = 'allToTalk',
    copy = 'copy',
    confirm = 'confirm',
    publish = 'publish',
    share = 'share',
    pick = 'pick',
    savePost = 'savePost',
    shareArena = 'shareArena',
    reportError = 'reportError',
}

export enum BaseFileType {
    image = 'image',
    video = 'video',
    audio = 'audio',
}

/**
 * 用户反馈数据结构
 */
export interface FeedbackData {
    tags: string[]
    text: string
}

/**
 * 带 feedback 扩展的 Payload
 */
export interface FeedbackPayloadExtension {
    feedbackData?: FeedbackData
}

/**
 * Feedback 相关的 UseType 联合类型
 */
export type FeedbackUseType = UseType.like | UseType.dislike

/**
 * 为不同的 UseType 定义专用的扩展数据
 */
interface UseTypePayloadExtensions {
    [UseType.like]: FeedbackPayloadExtension
    [UseType.dislike]: FeedbackPayloadExtension
}

/**
 * 基础 Payload 字段（所有 UseType 通用）
 */
interface BaseUseMessagePayload {
    idx?: number
    type?: BaseFileType
    itemHookRef?: HTMLElement | null
    url?: string
    cover_url?: string
}

/**
 * 为每个 UseType 生成精确的 Payload 类型映射
 */
type UseMessagePayloadMap = {
    [K in UseType]: K extends keyof UseTypePayloadExtensions
        ? BaseUseMessagePayload & { useType: K } & UseTypePayloadExtensions[K]
        : BaseUseMessagePayload & { useType?: K };
}

/**
 * 消息操作 Payload 泛型类型
 * @template T useType 的具体类型，默认为联合类型
 *
 * 使用示例:
 * ```typescript
 * // 精确类型（handler 定义时自动推导）
 * const handler: (payload: UseMessagePayload<UseType.like>) => void
 *
 * // 联合类型（handleItemClick 中使用）
 * const payload: UseMessagePayload
 * ```
 */
export type UseMessagePayload<T extends UseType = UseType> = T extends T ? UseMessagePayloadMap[T] : never

export interface IUploadConfigOverride {
    minLimit?: number
    maxLimit?: number
    imageCompressSize?: number
    acceptType?:
      | []
      | [BaseFileType.image]
      | [BaseFileType.video]
      | [BaseFileType.audio]
      | [BaseFileType.image, BaseFileType.video]
      | [BaseFileType.image, BaseFileType.audio]
      | [BaseFileType.video, BaseFileType.audio]
      | [BaseFileType.image, BaseFileType.video, BaseFileType.audio]
    acceptTypeIndex?: Record<string | number, IUploadConfigOverride['acceptType']>
    uploadSizeLimit?: {
        audio?: number
        video?: number
        image?: number
    }
    imageExtraLimit?: {
        minWidth?: number
        maxWidth?: number
        minHeight?: number
        maxHeight?: number
        minAspectRatio?: number
        maxAspectRatio?: number
    }
}

export interface IFileItem {
    file?: File
    url: string
    previewUrl?: string
    type: BaseFileType
    cover_url?: string
    previewCoverUrl?: string
    status?: 'uploading' | 'success' | 'remove' | 'error'
    uploadConfig?: IUploadConfigOverride
    [key: string]: any
}

/**
 * 上传文件选项
 */
export interface UploadFileOptions {
    /** 要上传的文件 */
    file: File
    /** 替换索引（如果指定，将替换该位置的文件） */
    replaceIndex?: number
    /** 上传配置覆盖 */
    uploadConfig?: IUploadConfigOverride
}

/**
 * 移除文件选项
 */
export interface RemoveFileOptions {
    /** 文件索引 */
    index: number
    /** 是否从数组中完全移除（默认 true） */
    clear?: boolean
}

/**
 * 验证文件选项
 */
export interface ValidateFileOptions {
    /** 要验证的文件 */
    file: File
    /** 上传配置覆盖 */
    uploadConfig?: IUploadConfigOverride
}

export type ToolActionHandler<T extends UseType = UseType> = (
    item: MessageChatNode,
    payload: UseMessagePayload<T>,
) => void
