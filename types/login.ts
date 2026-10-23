import type { FileData } from './file'

/** 弹窗类型 */
export enum DialogModeEnum {
    LOGIN = 'login',
    REGISTER = 'register',
}

/** 注册步骤 */
export enum RegisterStepEnum {
    ACCOUNT = 'ACCOUNT',
    PROFILE = 'PROFILE',
}

/** 注册角色枚举 */
export enum CarctorEnum {
    STUDENT = 'student',
    WORKER = 'worker',
    PLAYER = 'player',
}

/** 用户登录类型枚举 */
export enum UserLoginEnum {
    email = 0,
    phone = 1,
}

/** 注册请求参数 */
export interface RegisterRequestParam {
    nickName?: string
    email: string
    phone?: string
    password: string
    userRole?: number
    fileData?: FileData[]
}

/** 登录请求参数 */
export interface LoginRequestParam {
    email?: string
    phone?: string
    password: string
    loginType?: UserLoginEnum
}

/** 登录响应参数 */
export interface LoginResponse {
    uid: string
    nickname: string
    face: string
    email: string
    phone: string
    token: string
    userRole: number
    loginTime: number
}
