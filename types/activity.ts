export enum InfoType {
    TEMPLATE = 1,
    COMMENT = 2,
}

export type AddVoteParams = {
    infoType: InfoType
    infoId: string
    campaignId: string
}

export type GetUserVoteResponse = {
    userId: string
    maxVoteCount: number
    totalVoteCount: number
    remainingVoteCount: number
    canVote: boolean
}

/* -----------------------------------------活动相关类型----------------------------------------------- */

/**
 * 活动类型枚举
 */
export enum CampaignTypeEnum {
    /** 双周 */
    BIWEEKLY = 1,
    /** 主题 */
    TOPIC = 2,
    /** 特别 */
    SPECIAL = 3,
}

/**
 * 奖励类型枚举
 */
export enum RewardTypeEnum {
    CREDITS = 1,
    ITEM = 2,
    BADGE = 3,
}

/**
 * 活动状态枚举
 */
export enum CampaignStatusEnum {
    /** 未开始状态 */
    UPCOMING = 'Upcoming',
    /** 进行中状态 */
    LIVE_NOW = 'Live_Now',
    /** 已结束状态 */
    ENDED = 'Ended',
    /** 评选中状态 */
    JUDGING_IN_PROGRESS = 'Judging_In_Progress',
}

/**
 * 用户可选投票方式枚举
 */
export enum CreationMethodEnum {
    /** 上传 */
    UPLOAD = 1,
    /** 创建 */
    CREATE = 2,
    /** 双方 */
    BOTH = 3,
}

/**
 * 创建内容类型枚举
 */
export enum CreationContentTypeEnum {
    /** 图片 */
    IMAGE = 1,
    /** 视频 */
    VIDEO = 2,
    /** 双方 */
    BOTH = 3,
}
/**
 * 评选方式枚举
 */
export enum JudgingMethodEnum {
    /** 投票 */
    VOTE = 1,
}
/**
 * 获取活动列表参数
 */
export type GetActivityListParams = {
    currentPage?: number // 非必须
    pageSize?: number // 非必须
    campaignType?: number // 非必须 活动类型（可选）可能值：1=双周 2=主题 3=特别
    campaignStatus?: CampaignStatusEnum[] // 非必须 活动状态（可选）可能值：UPCOMING=未开始状态 LIVE_NOW=进行中状态 ENDED=已结束状态
    popupEnabled?: boolean // 非必须 弹窗开启状态（可选）true=只查询已开启弹窗的活动，false=只查询未开启弹窗的活动，null/不传=不过滤
}

/**
 * 获取活动列表响应
 */
export type GetActivityListResponse = {
    data: {
        campaignId: number // 活动ID
        campaignCode: string // 活动编码
        campaignType: CampaignTypeEnum // 活动类型
        startTime: string // 活动开始时间
        endTime: string // 活动结束时间（提交截止时间）
        coverImageUrl: string // Event Center卡片背景图片URL
        sortOrder: number // 排序权重
        campaignName: string // 活动名称（指定语言的多语言内容）
        campaignTitle: string // 活动标题（指定语言的多语言内容，页面标题展示）
        campaignSubtitle: string // 活动副标题（指定语言的多语言内容，卡片副标题展示）
        campaignDesc: string // 活动描述（指定语言的多语言内容）
        rewardDesc: string // 奖励描述（指定语言的多语言内容）
        rewardType: RewardTypeEnum // 奖励类型
        rewardValue: string // 奖励值
        popupTitle: string // 弹窗标题（指定语言的多语言内容）
        popupDesc: string // 弹窗描述（指定语言的多语言内容）
        campaignStatus: CampaignStatusEnum // 活动状态
        popupImageUrl: string // 弹窗图片URL
    }[]
    paginator: {
        currentPage: number
        pageSize: number
        totalPage: number
        totalRecord: number
    }
}

// 获取活动详情参数
export type GetActivityDetailParams = {
    campaignId: number // 活动ID
}

// 获取活动详情响应
export type GetActivityDetailResponse = {
    campaignId: number // 活动ID
    campaignType: CampaignTypeEnum // 活动类型
    startTime: string // 活动开始时间
    endTime: string // 活动结束时间
    creationMethod: CreationMethodEnum // 创建方式(用户可选的投稿方式)
    creationContentType: CreationContentTypeEnum // 创建内容类型
    judgingMethod: JudgingMethodEnum // 评选方式
    campaignDetailHtml: string // 活动详情HTML
    campaignName: string // 活动名称
    campaignTitle: string // 活动标题
    campaignSubtitle: string // 活动副标题
    campaignDesc: string // 活动描述
    coverImageUrl: string // 封面图片URL
    campaignStatus: CampaignStatusEnum // 活动状态
    remainingVoteCount: number // 剩余投票次数
    voteThreshold: number // 投票阈值
    canVote: boolean // 是否可以投票
    hasWinners: boolean // 是否有获奖者

}
export enum TaskProgressStateEnum {
    /** 进行中 */
    IN_PROGRESS = 1,
    /** 可领取 */
    CLAIMABLE = 2,
    /** 已完成 */
    COMPLETED = 3,
}
export enum TaskPathTypeEnum {
    /** 站内跳转 */
    IN_APP = 1,
    /** 站外跳转 */
    OUT_APP = 2,
    /** 无跳转 */
    NO_JUMP = 3,
}
export type GetTaskListParams = {
    // 支持值：daily_task（每日任务）、creator_task（创作者任务）
    // 不传表示查询所有类型
    taskType?: 'daily_task' | 'creator_task' // 任务类型
}

export type GetTaskListResponse = {
    [key in 'dailyTasks' | 'creatorTasks' | 'discordTasks']: {
        pathType: TaskPathTypeEnum
        pathUrl: string
        taskConfigId: number // 任务配置ID
        taskType: GetTaskListParams['taskType'] // 任务类型编码
        taskCode: string // 任务编码
        taskName: string // 任务名称（多语言）
        taskDesc: string // 任务描述（多语言）
        rewardType: RewardTypeEnum // 奖励类型
        rewardPoints: number // 奖励积分
        progressState: TaskProgressStateEnum // 任务进度状态
        startTime: number // 任务开始时间
        endTime: number // 任务结束时间
    }[];
}

export type ClaimTaskRewardParams = {
    taskCode: string // 任务编码
}

/**
 * 获取弹窗详情参数
 */
export type GetPopupDetailParams = {
    popCode: string // 弹窗编码
}

/**
 * 获取弹窗详情响应
 */
export type GetPopupDetailResponse = {
    popCode: string // 弹窗编码
    popType: number // 弹窗类型
    popupImage: string // 弹窗图片URL
    name: string // 弹窗名称
    title: string // 弹窗标题
    content: string // 弹窗内容
    relations: Array<{
        relationType: number // 关联类型
        relationId: string // 关联ID
        campaignId: number // 活动ID
        campaignCode: string // 活动编码
        campaignType: number // 活动类型
        startTime: string // 活动开始时间
        endTime: string // 活动结束时间
        campaignName: string // 活动名称
        campaignTitle: string // 活动标题
        campaignSubtitle: string // 活动副标题
        campaignDesc: string // 活动描述
        rewardDesc: string // 奖励描述
        rewardType: number // 奖励类型
        rewardValue: string // 奖励值
        sortOrder: number // 排序权重
        coverImageUrl: string // 封面图片URL
        popupTitle: string // 弹窗标题
        popupDesc: string // 弹窗描述
        popupImageUrl: string // 弹窗图片URL
        popupEnabled: boolean // 弹窗是否启用
        campaignStatus: string // 活动状态
        enableButton: boolean // 是否显示按钮
        buttonActionType: number // 按钮操作类型
        buttonRoute: string // 按钮路由
        buttonText: string // 按钮文本
    }>
}
/**
 * 活动通知类型
 */
export type CampaignNotice = {
    title: string // 通知标题
    link?: string // 跳转链接（可选）
}
