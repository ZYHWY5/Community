import { track } from '.'
import type { TrackOption } from '.'

interface TrackReportWithMessageParams extends TrackOption {
    f_page: 'template_share' | 'webhome' // template_share: 用户模版分享
    btn_position: 'content_card' | 'content_detail' | 'webhome' | 'create_with_ima' // content_card：内容卡 content_detail:内容详情页 webhome:首页推荐界面
    btn_name: 'try_click' | 'send_click_fromtry' | 'send' // try_click：【尝试该模版】按钮点击 send_click_fromtry：chat界面点击发送按钮
    cid?: string // 内容id
    creator_id?: string // 内容创建者id
}
/**
 * 上报登录相关行为
 */
export function trackReportWithMessage(params: TrackReportWithMessageParams) {
    track('ima_function_click', params)
}

interface TrackReportWithPublishParams extends TrackOption {
    f_page: 'webhome' //  webhome：app页面
    btn_position: 'create_with_ima' // create_with_ima
    btn_name: 'publish_click' | 'publish_expo' // publish_click：按钮点击 publish_expo：按钮曝光
    task_id: string // 任务id
    conversation_id: string // 对话id
    message_id: string // 消息id
}
/**
 * 上报发布相关行为
 */
export function trackReportWithPublish(params: TrackReportWithPublishParams) {
    track('ima_function_click', params)
}

interface TrackReportWithHubParams extends TrackOption {
    f_page: 'webhome' //  webhome：app页面
    btn_position: 'create_with_ima' // create_with_ima
    btn_name:
      | 'upload_file_click'
      | 'auto_mode_click'
      | 'manual_mode_click'
      | 'tag_click'
      | 'content_click'
      | 'content_expo' // upload_file_click：【+号】按钮点击 auto_mode_click:【auto mode】按钮点击 manual_mode_click：【manual mode】按钮点击 tag_click：标签点击，上报标签名 content_click: 模版点击 content_expo:模版曝光
    cid?: string // 内容id, 多个用,隔开
    tag_id?: string // 标签id
}
/**
 * 上报hub相关行为
 */
export function trackReportWithHub(params: Pick<TrackReportWithHubParams, 'btn_name' | 'cid' | 'tag_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'create_with_ima',
        ...params,
    })
}
