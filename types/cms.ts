import type { Paginator, GetCommunityDetailResponse, CommentStatusEnum } from './community'
import type { ManageResponseParams, ReviewStatusEnum } from './creator'
import type { FileData } from './file'

/** 侧边栏配置项 */
export interface SidebarOption {
    label: string
    status: StatusEnum
}

/** 状态枚举 */
export enum StatusEnum {
    /** 用户 */
    USER = 'user',
    /** 帖子 */
    POST = 'post',
    /** 评论 */
    COMMENT = 'comment'
}

/** ***************************************** CMS User ***************************************** */

/** 审核状态枚举 */
export enum PreviewStatusEnum {
    /** 待审核 */
    PENDING = 0,
    /** 审核通过 */
    APPROVED = 1,
    /** 审核拒绝 */
    REJECTED = -1,
}

/** 用户角色(权限)枚举 */
export enum UserRoleEnum {
    /** 游客 */
    TOURIST = 0,
    /** 正式会员 */
    USER = 1,
    /** 管理员 */
    ADMIN = 2,
}

/** 筛选表单 */
export interface FilterForm {
    uid?: string
    previewStatus?: PreviewStatusEnum
    userRole?: UserRoleEnum
}

/** 审核状态配置 */
export interface PreviewStatusOptions {
    label: string
    value: PreviewStatusEnum
}

/** 用户角色(权限)配置 */
export interface UserRoleOptions {
    label: string
    value: UserRoleEnum
}

/** 用户信息 */
export interface UserInfo {
    uid: string
    nickName: string
    email: string
    userRole: UserRoleEnum
    reviewStatus: PreviewStatusEnum
}

/** 获取用户列表请求参数 */
export interface GetUserListParams {
    /** 用户ID */
    uid?: string
    /** 审核状态 */
    previewStatus?: PreviewStatusEnum
    /** 用户角色(权限) */
    userRole?: UserRoleEnum
    /** 页码 */
    page: number
    /** 每页条数 */
    pageSize: number
}

/** 获取用户列表响应参数 */
export interface GetUserListResponse {
    /** 用户列表 */
    list: UserInfo[]
    /** 分页信息 */
    paginator: Paginator
}

/** 获取用户详情请求参数 */
export interface GetUserDetailParams {
    uid: string
}

/** 获取用户详情响应参数 */
export interface GetUserDetailResponse {
    uid: string
    nickName: string
    email: string
    phone: string
    userRole: UserRoleEnum
    reviewStatus: PreviewStatusEnum
    /** 用户上传的文件列表 */
    fileData: FileData[] | null
}

/** 更新用户详情请求参数 */
export interface UpdateUserDetailRequestParam {
    /** 更改用户的UID */
    uid: string
    /** 用户角色(权限) */
    userRole?: UserRoleEnum
    /** 审核状态 */
    reviewStatus?: PreviewStatusEnum
}

/** ***************************************** CMS Post(帖子) ***************************************** */

/** 获取帖子列表请求参数 */
export interface GetPostListParams {
    /** 搜索 */
    search?: string
    /** 审核状态 */
    status?: ReviewStatusEnum
    /** 页码 */
    page: number
    /** 每页条数 */
    pageSize: number
}

/** 获取帖子列表响应参数 */
export interface GetPostListResponse {
    /** 帖子列表 */
    list: ManageResponseParams[]
    /** 分页信息 */
    paginator: Paginator
}

/** 获取帖子详情请求参数 */
export interface GetPostDetailParams {
    /** 帖子ID */
    id: string
}

/** 获取帖子详情响应参数 */
export interface GetPostDetailResponse extends GetCommunityDetailResponse {
    /** 审核状态 */
    reviewStatus: ReviewStatusEnum
}

/** 审核帖子请求参数 */
export interface ReviewPostRequestParams {
    /** 帖子ID */
    id: string
    /** 审核状态 */
    reviewStatus: ReviewStatusEnum
}

/** ***************************************** CMS Comment(评论) ***************************************** */
/** 获取评论列表请求参数 */
export interface GetCommentListParams {
    /** 搜索(优先匹配评论正文，也支持评论id) */
    search?: string
    /** 评论状态(使用通用的审核状态枚举) */
    status?: CommentStatusEnum
    /** 页码 */
    page: number
    /** 每页条数 */
    pageSize: number
}

/** 评论项 */
export interface CommentItem {
    /** 评论ID */
    id: string
    /** 评论人头像 */
    face: string
    /** 评论人昵称 */
    nickName: string
    /** 评论创建时间 */
    createdAt: number
    /** 评论正文 */
    content: string
    /** 评论状态 */
    status: CommentStatusEnum
}

/** 获取评论列表响应参数 */
export interface GetCommentListResponse {
    /** 评论列表 */
    list: CommentItem[]
    /** 分页信息 */
    paginator: Paginator
}

/** 获取评论详情请求参数 */
export interface GetCommentDetailParams {
    /** 评论ID */
    id: string
}

/** 获取评论详情响应参数 */
export interface GetCommentDetailResponse {
    /** 评论ID */
    id: string
    /** 评论人头像 */
    face: string
    /** 评论人昵称 */
    nickName: string
    /** 评论创建时间 */
    createdAt: number
    /** 评论正文 */
    content: string
    /** 评论状态 */
    status: CommentStatusEnum
    /** 评论点赞数 */
    likeCount: number
    /** 评论回复数 */
    replyCount: number
    /** 评论所属帖子ID */
    pid: string
    /** 评论所属一级评论ID */
    root: string | null
    /** 评论层级 */
    level: number
}

/** 审核评论请求参数 */
export interface ReviewCommentParams {
    /** 评论ID */
    id: string
    /** 审核操作 */
    status: CommentStatusEnum
}

/** 审核评论响应参数 */
export interface ReviewCommentResponse {
    /** 评论ID */
    id: string
    /** 评论状态 */
    status: CommentStatusEnum
}