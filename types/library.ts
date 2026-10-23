/**
 * 素材库相关类型定义
 * Library types
 */

/**
 * 任务类型枚举
 */
export type TaskType = 'img' | 'video' | 'audio'

/**
 * 获取素材库列表参数
 */
export type GetLibraryListParams = {
    currentPage?: number // 当前页码 (默认 1)
    pageSize?: number // 每页数量 (默认 20)
    taskType: TaskType // 任务类型
}

/**
 * 删除素材库资源参数
 */
export type DeleteLibraryResourceParams = {
    id: number // 资源ID
    taskType: TaskType // 任务类型
}

/**
 * 素材库单项数据（API 返回）
 */
export type LibraryItem = {
    id: number // 资源ID
    msgId: string // 消息ID
    conversationId: string // 会话ID
    url: string // 资源URL
    createAt: number | null // 创建时间
    coverUrl: string // 封面URL
    coverThumbnailUrl: string // 封面缩略图URL
    coverWatermarkUrl: string | null // 封面水印URL
    videoWatermarkUrl: string | null // 视频水印URL
    width: string | null // 宽度
    height: string | null // 高度
}

/**
 * 分页器
 */
export type Paginator = {
    currentPage: number // 当前页码
    pageSize: number // 每页数量
    totalRecord: number // 总记录数
    totalPage: number | null // 总页数
    orderSegment: string | null // 排序段
}

/**
 * 获取素材库列表响应
 */
export type GetLibraryListData = {
    data: LibraryItem[] // 素材列表
    paginator: Paginator // 分页信息
}

/**
 * 获取素材库统计数据响应
 */
export type GetLibraryStatisticsData = {
    imgTotal: number // 图片总数
    videoTotal: number // 视频总数
    audioTotal: number // 音频总数
}
