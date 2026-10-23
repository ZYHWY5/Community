/** 社区状态枚举 */
export enum CommunityStatusEnum {
    /** 列表 */
    LIST = 'list',
    /** 详情 */
    DETAIL = 'detail',
}

/** 社区数据列表（用于社区首页展示） */
export interface CommunityItem {
    id: string
    createTime: string
    userInfo: {
        id: string
        face: string
        nickName: string
        level: number
    }
    content: {
        title: string
        desc: string
        imgUrl: string[]
        tag: {
            type: string
            name: string
            url: string
        }
    }
    likeCount: number
    commentCount: number
}

/** 分页信息 */
export interface Paginator {
    total: number
    page: number
    pageSize: number
}

/** 获取社区帖子列表参数 */
export interface GetCommunityListParams {
    page: number
    pageSize: number
}

/** 获取社区帖子列表响应 */
export interface GetCommunityListResponse {
    list: CommunityItem[]
    paginator: Paginator
}

/** 获取社区帖子详情参数 */
export interface GetCommunityDetailParams {
    id: string
}

/** 获取社区帖子详情响应 */
export interface GetCommunityDetailResponse {
    id: string
    createTime: string
    userInfo: {
        id: string
        face: string
        nickName: string
        level: number
    }
    content: {
        title: string
        content: string
        imgUrl: string[]
        tag: {
            type: string
            name: string
            url: string
        }
    }
    likeCount: number
    commentCount: number
    collectCount: number
    isLike: boolean
    isCollect: boolean
}

/** *************************************** 评论相关类型 *************************************** */

/** 评论层级枚举 */
export enum CommentLevelEnum {
    /** 一级评论 */
    FIRST = 1,
    /** 二级评论 */
    SECOND = 2,
    /** 回复二级评论的评论，同为二级评论 */
    SECOND_REPLY = 3,
}

/** 评论状态枚举 */
export enum CommentStatusEnum {
    /** 待审核 */
    PENDING = 0,
    /** 正常 */
    NORMAL = 1,
    /** 已删除 */
    DELETED = 2,
}

/** 点赞状态枚举 */
export enum LikeStatusEnum {
    /** 未点赞 */
    NOT_LIKE = 0,
    /** 已点赞 */
    LIKED = 1,
}

/** 评论项 */
export interface Comment {
    /** 评论唯一id */
    id: string
    /** 发布评论的用户id */
    uid: string
    /** 归属帖子id */
    pid: string
    /** 评论层级 */
    level: CommentLevelEnum
    /** 父级评论id，一级评论为 null */
    root: string | null
    /** 被回复的用户id，一级评论为 null */
    replyUid: string | null
    /** 评论内容 */
    content: string
    /** 评论状态 */
    status: CommentStatusEnum
    /** 点赞数 */
    likeCount: number
    /** 点赞状态 */
    likeStatus: LikeStatusEnum | null
    /** 回复数 */
    replyCount: number
    /** 创建时间（时间戳） */
    createdAt: number
    /** 发布评论的用户信息 */
    userInfo: {
        id: string
        avatar: string
        nickName: string
        level: number
    }
    /** 被回复的用户信息，一级评论为 null */
    replyUserInfo: {
        id: string
        nickName: string
    } | null
}

/** 评论项（包含一级评论和二级评论） */
export interface CommentItem {
    /** 一级评论 */
    firstComment: Comment
    /** 二级评论 */
    secondComments: Comment[]
}

/** 获取评论列表参数 */
export interface GetCommentListParams {
    /** 帖子id */
    pid: string
    page: number
    pageSize: number
}

/** 获取评论列表响应 */
export interface GetCommentListResponse {
    list: CommentItem[]
    paginator: Paginator
}

/** 获取二级评论列表参数 */
export interface GetSubCommentListParams {
    /** 父级一级评论id */
    root: string
    page: number
    pageSize: number
}

/** 获取二级评论列表响应 */
export interface GetSubCommentListResponse {
    list: Comment[]
    paginator: Paginator
}

/** 发布评论参数 */
export interface PostCommentParams {
    /** 归属帖子id */
    pid: string
    /** 评论内容 */
    content: string
    /** 父级评论id，发布一级评论时不传 */
    root?: string
    /** 被回复的用户id，发布一级评论时不传 */
    replyUid?: string
    /** 评论层级 */
    level?: CommentLevelEnum
}

/** 点赞评论参数 */
export interface LikeCommentParams {
    /** 评论id */
    id: string
}

/** 点赞评论响应 */
export interface LikeCommentResponse {
    /** 点赞状态 */
    status: LikeStatusEnum
}

/** 取消点赞评论参数 */
export interface CancelLikeCommentParams {
    /** 评论id */
    id: string
}

/** 取消点赞评论响应 */
export interface CancelLikeCommentResponse {
    /** 点赞状态 */
    status: LikeStatusEnum
}

/** 回复目标信息 */
export interface ReplyInfo {
    /** 一级评论 id（root） */
    root: string
    /** 被回复的用户 id */
    replyUid: string
    /** 被回复的用户昵称（用于输入框占位提示） */
    nickName: string
    /** 评论层级 */
    level: CommentLevelEnum
}

/** 删除评论参数 */
export interface DeleteCommentParams {
    /** 评论id */
    id: string
}

/** 删除评论响应 */
export interface DeleteCommentResponse {
    /** 评论 id */
    id: string
    /** 评论状态（2 = 已删除） */
    status: number
}

/** 话题类型（发布社区使用） */
export enum TopicType {
    CAMPAIGN = 'campaign',
    USER_AVAILABLE = 'userAvailable',
}
