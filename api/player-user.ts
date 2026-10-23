import type { AxiosRequestConfig } from 'axios'
import Api from '~/api/index'
import type { 
    RegisterRequestParam,
    LoginRequestParam,
    LoginResponse
} from '~/types/login'
import type {
    GetUserInfoRequestParam,
    GetUserInfoResponse,
    UpdateUserProfileRequestParam,
    UpdateUserProfileResponse
} from '~/types/player-user'

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

/** 用户注册 API */
export const register = (data: RegisterRequestParam) => post<any>({
    url: 'user/register',
    data,
})

/** 用户登录 API */
export const login = (data: LoginRequestParam) => post<LoginResponse>({
    url: 'user/login',
    data,
})

/** 获取用户信息 API */
export const getUserProfile = (data?: GetUserInfoRequestParam) => post<GetUserInfoResponse>({
    url: 'user/profile',
    data,
})

/** 更新用户信息 API */
export const updateUserProfile = (data: UpdateUserProfileRequestParam) => post<UpdateUserProfileResponse>({
    url: 'user/update',
    data,
})
