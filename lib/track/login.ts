import { track } from '.'
import type { TrackOption } from '.'

interface TrackReportWithLoginParams extends TrackOption {
    f_page: 'signup' | 'login' // signup：用户注册按钮点击 login：用户登录按钮点击
    btn_position: 'phone' | 'email' | 'google' // phone：手机号登录/注册 email：邮件登录/注册 google：谷歌快捷登录/注册
    btn_name: 'click' | 'expo' // click：按钮点击 expo：按钮曝光
}
/**
 * 上报登录相关行为
 */
export function trackReportWithLogin(params: TrackReportWithLoginParams) {
    track('ima_function_click', params)
}
