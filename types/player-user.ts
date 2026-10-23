/** 用户设置选项卡枚举 */
export enum UserSettingTab {
    /** 个人信息 */
    Profile = 'profile',
    /** 通用设置 */
    GeneralSetting = 'generalSetting',
}

/** 用户信息 */
export interface UserInfo {
    uid: string
    nickName: string
    face?: string
    email: string
    phone?: string
    token: string
    userRole: number
    level: number
}

/** 获取用户信息请求参数 */
export interface GetUserInfoRequestParam {
    uid?: string
}

/** 获取用户信息响应参数 */
export interface GetUserInfoResponse {
    uid: string
    nickName: string
    email: string
    phone: string
    userRole: number
    face: string
    token: string
    lastLogin: number
    level: number
}

/** 更新用户信息请求参数 */
export interface UpdateUserProfileRequestParam {
    nickName?: string
    face?: string
    phone?: string
}

/** 更新用户信息响应参数 */
export interface UpdateUserProfileResponse {
    nickName: string
    phone: string
    face: string
}
