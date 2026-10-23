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
 * 个人资料编辑点击 - 个人资料页面左上点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileEditClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * 个人资料分享点击 - 个人资料页面左上点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileShareClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * 模板编辑点击 - 模板编辑点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileTemplateEditClick(params: Pick<TrackProfileClickParams, 'btn_name' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * 模板编辑删除 - 模板编辑删除
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileTemplateEditDelete(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * 个人资料 Instagram 编辑点击 - 个人资料 Instagram 编辑点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileInsEditClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * YouTube 编辑点击 - 个人资料 YouTube 编辑点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileYtbEditClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * TikTok 编辑点击 - 个人资料 TikTok 编辑点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileTtEditClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * X 编辑点击 - 个人资料 X 编辑点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileXEditClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * 个人资料 Instagram 保存点击 - 个人资料 Instagram 保存点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileInsSaveClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * YouTube 保存点击 - 个人资料 YouTube 保存点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileYtbSaveClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * TikTok 保存点击 - 个人资料 TikTok 保存点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileTtSaveClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}

/**
 * X 保存点击 - 个人资料 X 保存点击
 * @param btn_position - 按钮位置
 * @param btn_name - 按钮名称
 */
export function trackProfileXSaveClick(params: Pick<TrackProfileClickParams, 'btn_name'>) {
    track('ima_function_click', {
        f_page: 'profile',
        btn_position: 'profile',
        ...params,
    })
}
