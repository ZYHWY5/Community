import type { FileData } from './file'

/** 状态枚举 */
export enum StatusEnum {
    /** 发布 */
    POST = 'post',
    /** 管理 */
    MANAGE = 'manage',
}

/** 选择项 */
export interface Selection {
    label: string
    value: StatusEnum
}

/** 发布请求参数 */
export interface PostRequestParams {
    /** 封面 */
    resourceList: FileData[]
    /** 标题 */
    title: string
    /** 简介 */
    desc: string
    /** 正文 */
    content: string
}

/** 审核状态枚举 */
export enum ReviewStatusEnum {
    APPROVED = 1,
    REJECTED = 2,
    PENDING = 0,
}

/** 管理请求参数 */
export interface ManageRequestParams {
    /** 搜索 */
    search?: string
    /** 审核状态 */
    status?: ReviewStatusEnum
    /** 页码 */
    page: number
    /** 每页条数 */
    pageSize: number
}

/** 管理响应参数 */
export interface ManageResponseParams {
    /** 帖子ID */
    id: string
    /** 封面 */
    cover: string
    /** 标题 */
    title: string
    /** 审核状态 */
    status: ReviewStatusEnum
    /** 创建时间 */
    createTime: string
    /** 点赞数 */
    likeCount: number
    /** 评论数 */
    commentCount: number
    /** 收藏数 */
    collectCount: number
}

/** 筛选表单 */
export interface ManageFilterForm {
    /** 搜索 */
    search?: string
    /** 审核状态 */
    status?: ReviewStatusEnum
}

/** 删除帖子请求参数 */
export interface DeleteRequestParams {
    /** 帖子ID */
    id: string
}

/** 获得帖子详情请求参数 */
export interface GetPostDetailRequestParams {
    /** 帖子ID */
    id: string
}

/** 获得帖子详情响应参数 */
export interface GetPostDetailResponse {
    /** 帖子ID */
    id: string
    /** 封面 */
    cover: string[]
    /** 标题 */
    title: string
    /** 简介 */
    desc: string
    /** 正文 */
    content: string
}

/** 更新帖子请求参数 */
export interface UpdatePostRequestParams {
    /** 帖子ID */
    id: string
    /** 封面 */
    resourceList: FileData[]
    /** 标题 */
    title: string
    /** 简介 */
    desc: string
    /** 正文 */
    content: string
}

/** 更新帖子响应参数 */
export interface UpdatePostResponse {
    /** 帖子ID */
    id: string
    /** 封面 */
    resourceList: FileData[]
    /** 标题 */
    title: string
    /** 审核状态 */
    reviewStatus: ReviewStatusEnum
}
