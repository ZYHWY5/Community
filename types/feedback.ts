export enum FeedbackType {
    Feedback = 1,
    Error = 2,
}

export type OpenFeedbackParams = {
    type: FeedbackType
    session_id: string
}

export type SubmitFeedbackParams = {
    feedbackTypeCode: string
    errorTitle: string
    errorDescription: string
    userEmail: string
    sessionId: string
    screenshotUrls: string[]
}

export type GetFeedbackTagsByMessageResponse = {
    id: number // 标签配置ID
    code: string // 标签配置代码
    icon: string // 标签图标URL
    color: string // 标签颜色
    sortOrder: number // 排序顺序
    name: string // 本地化名称
}

export type GetFeedbackListResponse = GetFeedbackTagsByMessageResponse[]

export type SubmitFeedbackByMessageParams = {
    contentId: string // 内容ID
    msgId: string // 消息ID
    likeStatus?: number | null // 点赞状态非必须 0=点赞，1=点踩，null=无点赞点踩操作
    contentType?: string // 内容类型
    pageUrl?: string // 页面URL
    sessionId: string // 会话ID
    feedbackContent?: string // 反馈内容
    feedbackTags?: string[] // 反馈标签列表
}
