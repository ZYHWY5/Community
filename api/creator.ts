import type { AxiosRequestConfig } from 'axios'
import Api from '~/api/index'
import type { PostRequestParams, ManageRequestParams, ManageResponseParams, DeleteRequestParams, GetPostDetailRequestParams, GetPostDetailResponse, UpdatePostRequestParams, UpdatePostResponse } from '~/types/creator'
import type { Paginator } from '~/types/community'

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

/** 发布帖子 API */
export const creatorPost = (data: PostRequestParams) => post<any>({
    url: 'creator/post',
    data,
})

/** 获取创作者帖子列表 API */
export const getManageList = (data: ManageRequestParams) => post<{ list: ManageResponseParams[], paginator: Paginator }>({
    url: 'creator/list',
    data,
})

/** 删除创作者帖子 API */
export const deletePost = (data: DeleteRequestParams) => post<any>({
    url: 'creator/delete',
    data,
})

/** 获取创作者帖子详情 API */
export const getPostDetail = (data: GetPostDetailRequestParams) => post<GetPostDetailResponse>({
    url: 'creator/detail',
    data,
})

/** 更新创作者帖子 API */
export const updatePost = (data: UpdatePostRequestParams) => post<UpdatePostResponse>({
    url: 'creator/update',
    data,
})
