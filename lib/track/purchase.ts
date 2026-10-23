import { track } from '.'
import type { TrackOption } from '.'

/**
 * 上报ima积分页展示、点击、购买相关的行为
 */

type TrackImaPayParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'point_page'
    btn_name: 'point_page_show' | 'point_page_click' | 'point_purchase_success'
    product_id: string
}

/**
 * 积分页展示上报
 * @param params.product_id - 方案ID（必填）
 */
export function trackPointPageShow() {
    track('ima_pay_event', {
        f_page: 'webhome',
        btn_position: 'point_page',
        btn_name: 'point_page_show',
    })
}

/**
 * 积分方案点击上报
 * @param params.product_id - 方案ID（必填）
 */
export function trackPointPageClick(params: Pick<TrackImaPayParams, 'product_id'>) {
    track('ima_pay_event', {
        f_page: 'webhome',
        btn_position: 'point_page',
        btn_name: 'point_page_click',
        product_id: params.product_id,
    })
}

/**
 * 积分购买成功上报
 * @param params.product_id - 方案ID（必填）
 */
export function trackPointPurchaseSuccess(params: Pick<TrackImaPayParams, 'product_id'>) {
    track('ima_pay_event', {
        f_page: 'webhome',
        btn_position: 'point_page',
        btn_name: 'point_purchase_success',
        product_id: params.product_id,
    })
}
