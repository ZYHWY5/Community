/**
 * 获取 CMS 用户详情 API
 * 需验证 token，且当前用户角色必须为管理员 (userRole === 2)
 * POST /api/cms/user/detail
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetUserDetailParams, GetUserDetailResponse } from '~/types/cms'
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

        const body = await readBody<GetUserDetailParams>(event)
        if (!body?.uid?.trim()) {
            return {
                code: 400,
                message: '缺少必要参数 uid',
            }
        }

        const [rows] = await pool.query(
            `SELECT uid, nickName, email, phone, userRole, reviewStatus, fileData
             FROM review
             WHERE uid = ?
             LIMIT 1`,
            [body.uid.trim()],
        )

        if (!(rows as any[]).length) {
            return {
                code: 404,
                message: '用户不存在',
            }
        }

        const row = (rows as any[])[0]
        const fileData
            = typeof row.fileData === 'string'
                ? JSON.parse(row.fileData)
                : row.fileData ?? null
        const data: GetUserDetailResponse = {
            uid: row.uid,
            nickName: row.nickName,
            email: row.email,
            phone: row.phone,
            userRole: row.userRole,
            reviewStatus: row.reviewStatus,
            fileData,
        }

        return {
            code: 200,
            message: 'ok',
            data,
        }
    }
    catch (error: any) {
        console.error('获取用户详情失败:', error)
        return {
            code: 500,
            message: '获取用户详情失败',
            error: error.message,
        }
    }
})
