import type dayjs from 'dayjs'

export type GetUserWorkStatisticsParams = {
    userId: string
}

export type GetUserWorkStatisticsResponse = {
    /** 总点赞数 用户所有作品获得的点赞数量总和 */
    totalLikeCount: number
    /** 总Remix数量 用户所有模板作品被引用/remix的次数总和 */
    totalRemixCount: number
    /** 全部帖子总数 (All Posts 计数) 用户发布的所有内容总数，包括模板和普通内容 只统计已审核通过且在线的内容（Published的非驳回的内容） */
    totalPostCount: number
    /** 统计数据更新时间 统计数据的最后更新时间戳 */
    lastUpdateTime: number
    /** 模板总数 */
    templateCount: number
    /** 视频帖子总数 (resourceType='video') */
    totalVideoPostCount: number
    /** 图片帖子总数 (resourceType='img') */
    totalImgPostCount: number
    /** 视频模板数 (resourceType='video' AND isTemplate=1) */
    videoTemplateCount: number
    /** 图片模板数 (resourceType='img' AND isTemplate=1) */
    imgTemplateCount: number
    /** 用户点赞过的视频帖子数 */
    likePostVideoCount: number
    /** 用户点赞过的图片帖子数 */
    likePostImgCount: number
}

export type GetUserContentListParams = {
    userId: string
    topicId: string
    pageNum: number
    pageSize: number
}

export type GetSystemConfigResponse = {
    popup: {
        id: string
        startTime: string
        endTime: string
    }[]
    serverTime: string
}

export type GlobalConfig = {
    // 进行中的活动
    activeOperation: ActiveOperationEnum[]
    serverTime?: dayjs.Dayjs
}

export enum ActiveOperationEnum {
    mit = 'mit',
}

/**
 * 置顶文章参数
 */
export type PinPostParams = {
    /** 文章ID，要置顶或取消置顶的文章ID，不能为空 */
    postId: string
}

/**
 * 取消置顶文章参数
 */
export type UnpinPostParams = {
    /** 文章ID，要置顶或取消置顶的文章ID，不能为空 */
    postId: string
}
