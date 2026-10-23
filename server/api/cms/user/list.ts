/**
 * 获取 CMS 用户列表 API
 * 需验证 token，且当前用户角色必须为管理员 (userRole === 2)
 * POST /api/cms/user/list
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetUserListParams, UserInfo } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'

export default defineEventHandler(async event => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.ADMIN })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<GetUserListParams>(event)
        const page = Math.max(1, body.page ?? 1)
        const pageSize = Math.min(50, Math.max(1, body.pageSize ?? 10))
        const offset = (page - 1) * pageSize
        const { uid, previewStatus, userRole } = body

        const conditions: string[] = []
        const params: any[] = []

        if (uid?.trim()) {
            conditions.push('uid LIKE ?')
            params.push(`%${uid.trim()}%`)
        }
        if (previewStatus !== undefined && previewStatus !== null) {
            conditions.push('reviewStatus = ?')
            params.push(previewStatus)
        }
        if (userRole !== undefined && userRole !== null) {
            conditions.push('userRole = ?')
            params.push(userRole)
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM review ${where}`,
            params,
        )
        const total = Number((countRows as any[])[0]?.total ?? 0)

        const [rows] = await pool.query(
            `SELECT uid, nickName, email, userRole, reviewStatus
             FROM review
             ${where}
             ORDER BY uid DESC
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset],
        )

        const list: UserInfo[] = (rows as any[]).map(row => ({
            uid: String(row.uid ?? ''),
            nickName: String(row.nickName ?? ''),
            email: String(row.email ?? ''),
            userRole: Number(row.userRole) as UserInfo['userRole'],
            reviewStatus: Number(row.reviewStatus) as UserInfo['reviewStatus'],
        }))

        return {
            code: 200,
            message: 'ok',
            data: {
                list,
                paginator: {
                    total,
                    page,
                    pageSize,
                },
            },
        }
    }
    catch (error: any) {
        console.error('获取用户列表失败:', error)
        return {
            code: 500,
            message: '获取用户列表失败',
            error: error.message,
        }
    }
})
