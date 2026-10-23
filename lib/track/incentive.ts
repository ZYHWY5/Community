import { track } from '.'
import type { TrackOption } from '.'

/**
 * 上报用户激励计划相关的行为
 */

type TrackIncentiveClickParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'user_incentive'
    btn_name: 'user_incentive_entry_click' | 'user_incentive_submit_click' | 'user_incentive_close_click'
    tag_id?: string
    banner_id?: string
    cid?: string
    creator_id?: string
}

/**
 * 用户激励入口点击 - 侧边栏按钮点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 */
export function trackUserIncentiveEntryClick(params?: Pick<TrackIncentiveClickParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'user_incentive',
        btn_name: 'user_incentive_entry_click',
        ...params,
    })
}

/**
 * 用户激励submit点击 - 用户激励submit按钮点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 */
export function trackUserIncentiveSubmitClick(params?: Pick<TrackIncentiveClickParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'user_incentive',
        btn_name: 'user_incentive_submit_click',
        ...params,
    })
}

/**
 * 用户激励关闭点击 - 用户激励关闭按钮点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 */
export function trackUserIncentiveCloseClick(params?: Pick<TrackIncentiveClickParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'user_incentive',
        btn_name: 'user_incentive_close_click',
        ...params,
    })
}

// 打开曝光
export function trackUserIncentiveOpenExposure(params?: Pick<TrackIncentiveClickParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'user_incentive',
        btn_name: 'user_incentive_show',
        ...params,
    })
}
