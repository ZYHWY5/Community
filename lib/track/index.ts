type TrackEvent = 'ima_function_click' | 'ima_pay_event'
export interface TrackOption {
    f_page: string
    btn_position: string
    btn_name: string
    params?: Record<string, any>
    [key: string]: any
}

interface TrackImOptions {
    lmweb_clickText: string
    lmweb_tabName?: string //
    lmweb_giftId?: string // 礼物ID
    lmweb_giftPriceLong?: string | number // 礼物价格
    lmweb_LiveUid?: string // Uid
    lmweb_LiveVid?: string // 直播间Vid
    tongdun_black_box?: string
}

interface TrackLoginReportOptions {
    state: string // success fail
    type: string | number // =0 是登录 =1 是注册
    uid: string // uid
    timestamp: string | number // 时间戳
    way: string | number // 方式 REG_TYPE
    account: string // 账号
    returnInfo: string
}

export function track(event: TrackEvent, options: TrackOption) {
    if (import.meta.client && window.KEWLSensors) {
        window.KEWLSensors.track(event, options)
    }
}

// 兼容liveme迁移，新埋点请勿使用
export function trackImSite(options: TrackImOptions) {
    if (import.meta.client && window.KEWLSensors) {
        window.KEWLSensors.track('kewlweb_Imsite', options)
    }
}
// 兼容liveme迁移，新埋点请勿使用
export function trackLoginReport(options: TrackLoginReportOptions) {
    if (import.meta.client && window.KEWLSensors) {
        window.KEWLSensors.track('kewlweb_logregpoint', options)
    }
}
