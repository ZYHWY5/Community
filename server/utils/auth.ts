import type { H3Event } from 'h3'
import pool from '~/server/db/mysql'
import { UserRoleEnum } from '~/types/cms'

/**
 * Token 验证结果接口
 */
export interface TokenValidationResult {
    success: boolean
    uid?: string
    token?: string
    /** 来自 review.userRole，仅在传入 requiredRole 且校验通过时返回 */
    userRole?: number
    message?: string
    code?: number
}

/**
 * validateToken 可选配置：是否校验 CMS 审核体系中的用户角色（review.userRole）
 */
export interface ValidateTokenOptions {
    /**
     * 若指定，则在 token 有效后查询 review 表，要求 userRole >= 该值
     * - `UserRoleEnum.ADMIN`：仅管理员
     * - `UserRoleEnum.USER`：正式会员及以上
     * - `UserRoleEnum.TOURIST`：仅游客（按需使用）
     */
    requiredRole?: UserRoleEnum
}

function roleForbiddenMessage(required: UserRoleEnum): string {
    if (required === UserRoleEnum.ADMIN) {
        return '无权限，仅管理员可访问'
    }
    if (required === UserRoleEnum.USER) {
        return '无权限，仅正式会员可访问'
    }
    if (required === UserRoleEnum.TOURIST) {
        return '无权限访问'
    }
    return '无权限访问'
}

/**
 * 验证请求的 token 是否有效；可选校验 CMS 侧角色（review 表）
 * @param event H3Event 对象
 * @param options 不传或 `requiredRole` 未设置时，仅校验登录态，不查角色
 * @returns TokenValidationResult 验证结果
 */
export async function validateToken(
    event: H3Event,
    options?: ValidateTokenOptions,
): Promise<TokenValidationResult> {
    try {
        // 从 cookie 中获取 token
        const tokenFromCookie = getCookie(event, 'token')
        const token = tokenFromCookie

        // 验证 token 是否存在
        if (!token) {
            return {
                success: false,
                code: 401,
                message: '请先登录',
            }
        }

        // 根据 token 查询 session 获取 uid
        const [sessions] = await pool.query(
            'SELECT uid, endTime FROM sessions WHERE token = ? LIMIT 1',
            [token],
        )

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return {
                success: false,
                code: 401,
                message: 'Token 无效，请重新登录',
            }
        }

        const session = sessions[0] as any

        // 检查 token 是否过期
        const currentTime = Date.now()
        if (session.endTime < currentTime) {
            /** 删除过期的记录 */
            await pool.query('DELETE FROM sessions WHERE token = ?', [token])

            return {
                success: false,
                code: 401,
                message: 'Token 已过期，请重新登录',
            }
        }

        const uid = String(session.uid ?? '')

        if (options?.requiredRole === undefined) {
            return {
                success: true,
                uid,
                token,
            }
        }

        const [currentUserRows] = await pool.query(
            'SELECT userRole FROM review WHERE uid = ? LIMIT 1',
            [uid],
        )
        const row = (currentUserRows as any[])[0]
        const dbRole = row != null ? Number(row.userRole) : NaN

        if (Number.isNaN(dbRole)) {
            return {
                success: false,
                code: 403,
                message: roleForbiddenMessage(options.requiredRole),
            }
        }

        if (dbRole < options.requiredRole) {
            return {
                success: false,
                code: 403,
                message: roleForbiddenMessage(options.requiredRole),
            }
        }

        return {
            success: true,
            uid,
            token,
            userRole: dbRole,
        }
    }
    catch (error: any) {
        console.error('Token 验证失败:', error)
        return {
            success: false,
            code: 500,
            message: '服务器错误',
        }
    }
}
