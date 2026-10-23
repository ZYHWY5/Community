import { track } from '.'
import type { TrackOption } from '.'

/**
 * 上报个人资料相关的行为
 */

type TrackProfileClickParams = TrackOption & {
    f_page: 'profile'
    btn_position: string
    btn_name: string
    ima_function_click?: string
    creator_id?: string
}

/**
 * 活动弹窗曝光
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackPopupExpoClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'homepage_popup',
        ...params,
    })
}

/**
 * 活动弹窗关闭
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackPopupCloseClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'homepage_popup',
        ...params,
    })
}

/**
 * 活动弹窗跳转详情页
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackPopupToDetailClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'homepage_popup',
        ...params,
    })
}
