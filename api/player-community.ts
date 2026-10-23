import type { AxiosRequestConfig } from 'axios'
import Api from '~/api/index'
import type {
    GetCommunityListParams,
    GetCommunityListResponse,
    GetCommunityDetailParams,
    GetCommunityDetailResponse,
    GetCommentListParams,
    GetCommentListResponse,
    GetSubCommentListParams,
    GetSubCommentListResponse,
    PostCommentParams,
    LikeCommentParams,
    LikeCommentResponse,
    CancelLikeCommentParams,
    CancelLikeCommentResponse,
    DeleteCommentParams,
    DeleteCommentResponse,
} from '~/types/community'

const post: <T = any>(opt: { url: string, data?: Record<string, any>, config?: AxiosRequestConfig }) => Promise<T> = <
    T = any,
>(opt: {
    url: string
    data?: Record<string, any>
    config?: AxiosRequestConfig
}) => {
    const payload: AxiosRequestConfig = {
        authRequired: true,
        ...(opt.config || {}),
    }
    return Api.post<T>(`/api/${opt.url}`, Object.assign({}, opt.data || {}), payload)
}

/** 获取社区帖子列表 API */
export const getCommunityList = (data: GetCommunityListParams) => post<GetCommunityListResponse>({
    url: 'community/list',
    data,
})

/** 获取社区帖子详情 API */
export const getCommunityDetail = (data: GetCommunityDetailParams) => post<GetCommunityDetailResponse>({
    url: 'community/detail',
    data,
})

/** 获取一级评论列表 API（每条一级评论携带前 3 条二级评论） */
export const getCommentList = (data: GetCommentListParams) => post<GetCommentListResponse>({
    url: 'community/comment/list',
    data,
})

/** 获取二级评论列表 API */
export const getSubCommentList = (data: GetSubCommentListParams) => post<GetSubCommentListResponse>({
    url: 'community/comment/detail',
    data,
})

/** 发布评论 API（需登录，正式会员及以上） */
export const postComment = (data: PostCommentParams) => post<any>({
    url: 'community/comment/post',
    data,
})

/** 点赞评论 API */
export const likeComment = (data: LikeCommentParams) => post<LikeCommentResponse>({
    url: 'community/comment/like',
    data,
})

/** 取消点赞评论 API */
export const cancelLikeComment = (data: CancelLikeCommentParams) => post<CancelLikeCommentResponse>({
    url: 'community/comment/cancel',
    data,
})

/** 删除评论 API（软删除，需登录，正式会员及以上） */
export const deleteComment = (data: DeleteCommentParams) => post<DeleteCommentResponse>({
    url: 'community/comment/delete',
    data,
})
