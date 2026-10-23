export enum UserLoginEnum {
    fb = 101, // facebook
    twitter = 103, // twitter
    google = 102, // google
    googleOneTap = 114, // 谷歌一键登录、谷歌快捷登录
    ins = 105, // instagram
    line = 110, // line
    email = 108, // email
    phone = 104, // phone
}

export enum PointRecordType {
    get = 1, // 获得
    consume = 2, // 消耗
}

export interface PointRecordItem {
    businessType: string
    createdAt: number
    creditAmount: number
    creditType: number
    id: number
    recordType: PointRecordType
    remark: string
    status: number
    userId: string
}

export interface PointDetailItem {
    id: number
    user_id: string
    total_credit_amount: number
    remain_credit_amount: number
    start_time: number
    end_time: number
    status: number
    expired: boolean
    remark: string
}

export enum InviteStatus {
    unused = 0, // 未使用
    used = 1, // 已使用
    expired = 2, // 已过期
}

export interface InviteRecordItem {
    createdAt: number
    expireTime: number
    id: number
    inviteCode: string
    inviteStatus: InviteStatus
    invitedUserId: string
    updatedAt: number
    userId: string
}

export enum PointConfigKey {
    inviteRewardAmount = 'invite_reward_amount', // 分享奖励积分
}

export interface PointConfig {
    config_key: PointConfigKey
    config_type: number
    config_value: string
    updated_at: number
}

export enum UserRoleEnum {
    none = 0, // 未申请
    pending = 1, // 待审核
    creator = 2, // 创作者
    rejected = 3, // 审核拒绝
}
export enum OnboardedStatus {
    notOnboarded = 0, // 不展示
    onboarded = 1, // 展示
}

export interface UserInfo {
    uid: string
    face: string
    username: string
    nickname: string
    deviceId: string
    token: string
    loginType?: UserLoginEnum
    email: string
    mobile: string
    hasUseInviteCode: HasUseInviteCode
    applicationStatus: ApplicationStatus
    isApplication: boolean
    showBadgeNotice?: boolean
    membershipType: string
    onboarded: OnboardedStatus
    userRole: UserRoleEnum
    userLevel: number
    agree_free_distributed: boolean
    profile: string
    instagram: string
    youtube: string
    tiktok: string
    x: string
    badges: Badge[]
    language?: string
}

// 获取用户信息的返回
export interface UserInfoResponse {
    user_id: string
    avatar: string
    nickname: string
    email: string
    mobile: string
    token: string
    register_time: number
    last_login: number
    device_id: string
    device_type: string
    reg_type?: UserLoginEnum
    has_use_invite_code: HasUseInviteCode
    application_status: ApplicationStatus
    is_application: boolean
    membership_type: string
    creator_status: UserRoleEnum
    onboarded: OnboardedStatus
    agree_free_distributed: boolean
    profile: string
    instagram: string
    youtube: string
    tiktok: string
    x: string
    show_badge_animation?: number
    badges: Badge[]
    language?: string
    creator_tier: number
}

export enum HasUseInviteCode {
    unused = 0, // 未使用
    used = 1, // 已使用
}

export enum ApplicationStatus {
    notApplied = -1, // 未申请
    pending = 0, // 审核中
    approved = 1, // 审核通过
    rejected = 2, // 审核失败
}
export type Badge = {
    badge_code: string
    badge_image: string
    badge_name: string
    badge_style: string
    created_at: string
    expired_at: string
    is_wearing: boolean
    link_type: number // 链接类型 1:站内 2:站外 3:活动
    link_url: string // 链接URL（活动则为活动id）
}

export interface UserInfoDetailResponse {
    user_id: string
    avatar: string
    nickname: string
    username: string
    email: string
    status: string
    created_at: string
    updated_at: number
    has_use_invite_code: HasUseInviteCode
    application_status: ApplicationStatus
    membership_type: string
    is_application: boolean
    creator_status: UserRoleEnum
    creator_tier: number
    // 1.4.1新增属性
    agree_free_distributed: boolean
    profile: string
    instagram: string
    youtube: string
    tiktok: string
    x: string
    discord_id: string
    badges: Badge[]
    show_badge_animation?: number
    onboarded: OnboardedStatus
    language?: string
    fav_vis: number
}

export interface ApplyInviteCodeData {
    email: string
    reason: string
    profession: string
    social_media: string
}

// 创作焦点枚举
export enum CreativeFocus {
    WRITING = 1, // 写作
    DESIGN = 2, // 设计
    PHOTOGRAPHY = 3, // 摄影
    VIDEO = 4, // 视频
    MUSIC = 5, // 音乐
    ART = 6, // 艺术
    TECHNOLOGY = 7, // 技术
    EDUCATION = 8, // 教育
    OTHER = 9, // 其他
}

// 创作者申请数据
export interface CreatorApplicationData {
    name: string
    contact_information: string
    location: string
    region?: string
    creative_focus: string
    sub_creative_focus?: string
    link_to_work?: string
    creation_introduction: string
    motivation: string
    experience?: string
    social_media?: string
    post_url?: string
    expectations?: string
    phone?: string
    we_chat?: string
    whatsapp?: string
    country_code?: string
    lang?: string
}

// 创作者申请响应
export interface CreatorApplicationResponse {
    code: number
    message: string
    data?: any
}

// 创作者申请状态查询参数
export interface CreatorApplicationStatusParams {
    contact_info: string
}

// 创作者申请状态查询响应
export interface CreatorApplicationStatusResponse {
    exists: boolean
}

/**
 * 兑换 Discord 码参数
 */
export type RedeemDiscordCodeParams = {
    /** 兑换码，格式为 DC + 6 位字母数字，区分大小写，示例：DC3AB5XY */
    code: string
}

/**
 * 兑换 Discord 码响应
 * 注意：只定义 data 字段的结构，code 和 message 不需要定义
 */
export type RedeemDiscordCodeResponse = {
    /** 兑换是否成功 */
    success: boolean
    /** 奖励积分数量 */
    rewardPoints: number
    /** Discord 用户名，生成该兑换码的 Discord 用户名 */
    discordUsername: string
    /** 提示消息，多语言消息，根据请求语言返回 */
    message: string
}
