import type { AxiosRequestConfig } from 'axios'
import Api from '~/api/index'
import type {
    GetUserListParams,
    GetUserListResponse,
    GetUserDetailParams,
    GetUserDetailResponse,
    UpdateUserDetailRequestParam,
    GetPostListParams,
    GetPostListResponse,
    GetPostDetailParams,
    GetPostDetailResponse,
    ReviewPostRequestParams,
    GetCommentListParams,
    GetCommentListResponse,
    GetCommentDetailParams,
    GetCommentDetailResponse,
    ReviewCommentParams,
    ReviewCommentResponse,
} from '~/types/cms'

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

/** 获取用户列表 API */
export const getUserList = (data: GetUserListParams) => post<GetUserListResponse>({
    url: 'cms/user/list',
    data,
})

/** 获取用户详情 API */
export const getUserDetail = (data: GetUserDetailParams) => post<GetUserDetailResponse>({
    url: 'cms/user/detail',
    data,
})

/** 更新用户详情 API */
export const updateUserDetail = (data: UpdateUserDetailRequestParam) => post<any>({
    url: 'cms/user/update',
    data,
})

/** CMS 获取帖子列表 */
export const getPostList = (data: GetPostListParams) => post<GetPostListResponse>({
    url: 'cms/post/list',
    data,
})

/** CMS 获取帖子详情 */
export const getPostDetail = (data: GetPostDetailParams) => post<GetPostDetailResponse>({
    url: 'cms/post/detail',
    data,
})

/** CMS 审核帖子（通过写入 community_list，拒绝则从 community_list 删除） */
export const reviewPost = (data: ReviewPostRequestParams) => post<any>({
    url: 'cms/post/review',
    data,
})

/** CMS 获取评论列表 */
export const getCommentList = (data: GetCommentListParams) => post<GetCommentListResponse>({
    url: 'cms/comment/list',
    data,
})

/** CMS 获取评论详情 */
export const getCommentDetail = (data: GetCommentDetailParams) => post<GetCommentDetailResponse>({
    url: 'cms/comment/detail',
    data,
})

/** CMS 审核评论 */
export const reviewComment = (data: ReviewCommentParams) => post<ReviewCommentResponse>({
    url: 'cms/comment/review',
    data,
})
