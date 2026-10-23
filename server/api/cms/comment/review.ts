/**
 * CMS 审核评论 API
 * 需验证 token 且为管理员；同步更新 comment.status
 * POST /api/cms/comment/review
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { ReviewCommentParams, ReviewCommentResponse } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'
import { CommentStatusEnum } from '~/types/community'

export default defineEventHandler(async event => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.ADMIN })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<ReviewCommentParams>(event)
        const id = body?.id?.trim()
        if (!id) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const status = Number(body?.status)
        if (status === CommentStatusEnum.PENDING) {
            return {
                code: 400,
                message: 'status=0 不支持审核操作',
            }
        }

        if (status !== CommentStatusEnum.NORMAL && status !== CommentStatusEnum.DELETED) {
            return {
                code: 400,
                message: 'status 参数不合法',
            }
        }

        const [rows] = await pool.query(
            'SELECT id FROM comment WHERE id = ? LIMIT 1',
            [id],
        )
        if (!(rows as any[]).length) {
            return {
                code: 404,
                message: '评论不存在',
            }
        }

        await pool.query(
            'UPDATE comment SET status = ? WHERE id = ?',
            [status, id],
        )

        const data: ReviewCommentResponse = {
            id,
            status: status as CommentStatusEnum,
        }

        return {
            code: 200,
            message: 'ok',
            data,
        }
    }
    catch (error: any) {
        console.error('CMS 审核评论失败:', error)
        return {
            code: 500,
            message: '审核评论失败',
            error: error.message,
        }
    }
})
