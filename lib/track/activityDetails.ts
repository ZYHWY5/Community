import { track } from '.'
import type { TrackOption } from '.'

/**
 * 上报活动详情页相关的行为
 */

// ===== 活动详情页展示次数及入口点击 =====

type TrackActivityDetailsPageParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'event_center_page'
    btn_name?: string
    tag_id?: string
    banner_id?: string
    cid?: string
    creator_id?: string
}

/**
 * 活动详情页曝光 - MIT活动详情页页面曝光
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityDetailsPageExpo(params?: Pick<TrackActivityDetailsPageParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center_page',
        btn_name: params?.btn_name || '',
        ...params,
    })
}

/**
 * 活动详情页Upload点击 - MIT活动详情页Upload点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityDetailsUploadClick(params?: Pick<TrackActivityDetailsPageParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center_page',
        btn_name: params?.btn_name || '',
        ...params,
    })
}

/**
 * 活动详情页Create点击 - MIT活动详情页Create点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 */
export function trackActivityDetailsCreateClick(params?: Pick<TrackActivityDetailsPageParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center_page',
        btn_name: params?.btn_name || '',
        ...params,
    })
}

/**
 * 活动详情页Share点击 - MIT活动详情页Share点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityDetailsShareClick(params?: Pick<TrackActivityDetailsPageParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center_page',
        btn_name: params?.btn_name || '',
        ...params,
    })
}
export function trackActivityDetailsSeeDetailAndJoinClick(params?: Pick<TrackActivityDetailsPageParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center_page',
        btn_name: params?.btn_name || '',
        ...params,
    })
}

// ===== 活动详情页入口进入统计 =====

type TrackActivityEntryParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'homepage_popup' | 'content_card' | 'content_detail' | 'event_center'
    btn_name: 'popup_join_click' | 'content_card_tag_click' | 'content_detail_join_click' | 'content_detail_tag_click' | 'event_center_join_click'
    tag_id?: string
    banner_id?: string
    cid?: string
    creator_id?: string
    activity_id?: string
}

/**
 * 活动首页弹窗Join点击 - 首页弹窗join点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityPopupJoinClick(params?: Pick<TrackActivityEntryParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'homepage_popup',
        btn_name: 'popup_join_click',
        ...params,
    })
}

/**
 * 活动内容卡Tag点击 - 内容卡tag点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityContentCardTagClick(params?: Pick<TrackActivityEntryParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'content_card',
        btn_name: 'content_card_tag_click',
        ...params,
    })
}

/**
 * 活动详情页Tag点击 - 详情页tag点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityContentDetailTagClick(params?: Pick<TrackActivityEntryParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'content_detail',
        btn_name: 'content_detail_tag_click',
        ...params,
    })
}

/**
 * 活动事件中心Join点击 - 事件中心页join点击
 * @param tag_id - 标签ID
 * @param banner_id - banner ID
 * @param cid - 模版ID
 * @param creator_id - 创建者ID
 * @param activity_id - 活动ID
 */
export function trackActivityEventCenterJoinClick(params?: Pick<TrackActivityEntryParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'event_center',
        btn_name: 'event_center_join_click',
        ...params,
    })
}

// 活动详情页入口进入统计
type TrackActivityDetailsEntryParams = TrackOption & {
    f_page: 'webhome'
    btn_position: string
    btn_name: string
    tag_id?: string
    banner_id?: string
    cid?: string
    creator_id?: string
}
export function trackActivityDetailsEntryClick(params?: Pick<TrackActivityDetailsEntryParams, 'tag_id' | 'banner_id' | 'cid' | 'creator_id' | 'btn_name' | 'btn_position'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: params?.btn_position || '',
        btn_name: params?.btn_name || '',
        ...params,
    })
}
