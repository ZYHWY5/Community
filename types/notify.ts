import type dayjs from 'dayjs'

export enum NotifyJumpType {
    Inner = 1, // 站内
    Outer = 2, // 站外
    Detail = 3, // 通知详情页
}
export enum NotifyCategory {
    Activity = 'activity', // 活动
    Interactive = 'interactive', // 互动
    Official = 'official', // 官方
}
export type INotifyItem = {
    id: string
    category: NotifyCategory
    jumpType: NotifyJumpType
    jumpInfo: string
    icon: string
    message: string
    createTime: dayjs.Dayjs
    createTimeText: string
    updateTime: dayjs.Dayjs
    updateTimeText: string
    isRead: boolean
    updated: number
}

export type GetActivityNotifyListResponse = {
    id: number
    linkType: number
    content: string
    linkUrl: string
    position: string
    isOnline: string
}[]

export type GetAllNotifyListParams = {
    categories?: NotifyCategory[]
    updated?: number
    count?: number
    asc?: boolean
    isRead?: boolean
}
export type GetNotifyContent = {
    businessCode: string // 业务唯一码
    jumpInfo: string // 跳转信息
    jumpType: NotifyJumpType
    content: string // 内容
    icon: string // 图例
    createTime: number // 时间戳
    category: NotifyCategory // 分类
}
export type GetAllNotifyListResponse = {
    list: {
        id: string // 非必须 通知ID
        type?: string // 非必须 通知类型
        content?: GetNotifyContent
        to: string // 非必须 接收者用户ID
        from: string // 非必须 发送者用户ID
        appId: string // 非必须 应用ID
        read: boolean // 非必须 是否已读
        msgId: string // 非必须 消息ID
        created?: number // 非必须 创建时间戳
        updated?: number // 非必须 更新时间戳
    }[]
    categoryUnreadCount: {
        [key in NotifyCategory]?: number
    }
}

export type GetNotifyDetailResponse = {
    id: string
    content: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
}
