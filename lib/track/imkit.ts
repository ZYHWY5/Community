import { trackImSite } from './index'
import type { IMOptionsMode } from '~/composables/useIMKit/types'

export function trackIMKitLogin(userInfo: IMOptionsMode['userInfo']) {
    trackImSite({
        lmweb_clickText: 'imkit_login',
        lmweb_tabName: JSON.stringify(userInfo),
    })
}

/**
 * 上报用户满意度
 * @param params.uid 用户id @type {string}
 * @param params.convId 会话id @type {string}
 * @param params.planingId 计划id @type {string} 不一定有
 * @param params.taskId 任务ID @type {string}
 * @param params.msgId 消息id @type {string}
 * @param params.isResult 是否是结果 @type {boolean} 需要服务端及前端一起调整
 * @param params.feedbackResults 反馈结果 @type {number} 1：like  2：点击dislike 3：点击like后点击了OK
 * @param params.userFeedback 用户填写反馈 @type {string} 当用户点击dislike时，会弹出反馈内容填写，可以为空
 */
export function trackIMATaskUserFeedback(params: {
    uid: string
    convId: string
    msgId: string
    planingId?: string
    taskId?: string
    isResult?: string
    feedbackResults?: number
    userFeedback?: string
}) {
    if (import.meta.client && window.KEWLSensors) {
        window.KEWLSensors.track('taskReport', {
            uid: params.uid,
            conversation_id: params.convId,
            message_id: params.msgId,
            planingid: params.planingId,
            task_id: params.taskId,
            is_result: params.isResult,
            feedback_results: params.feedbackResults,
            user_feedback: params.userFeedback,
        })
    }
}
