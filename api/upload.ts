import type { AxiosRequestConfig } from 'axios'
import Api from '~/api/index'

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

export const uploadFile = (data: { file: File }) => {
    // 创建 FormData
    const formData = new FormData()
    formData.append('file', data.file)
    
    return Api.post<any>('/api/upload/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}