import { track } from '.'
import type { TrackOption } from '.'

type TrackPostPublishParams = TrackOption & {
    f_page: 'profile'
    btn_position: string
    btn_name: string
    ima_function_click?: string
    creator_id?: string
}

// post的视频发布
export function trackPostVideoPublish(params: Pick<TrackPostPublishParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'home',
        ...params,
    })
}

// post的图片发布
export function trackPostImagePublish(params: Pick<TrackPostPublishParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'home',
        ...params,
    })
}

// 点赞上报
export function trackLike(params: Pick<TrackPostPublishParams, 'btn_position'>) {
    track('ima_function_click', {
        f_page: 'template_like',
        btn_name: 'like_click',
        ...params,
    })
}
