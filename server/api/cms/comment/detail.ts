/**
 * CMS 获取评论详情 API
 * 需验证 token 且为管理员；数据来自 comment
 * POST /api/cms/comment/detail
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetCommentDetailParams, GetCommentDetailResponse } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'
import type { CommentStatusEnum } from '~/types/community'

export default defineEventHandler(async event => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.ADMIN })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<GetCommentDetailParams>(event)
        const id = body?.id?.trim()
        if (!id) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const [rows] = await pool.query(
            `SELECT
                c.id,
                c.pid,
                c.root,
                c.level,
                c.content,
                c.status,
                c.like_count,
                c.reply_count,
                c.created_at,
                u.face,
                u.nickName
             FROM comment c
             LEFT JOIN user u ON u.uid = c.uid
             WHERE c.id = ?
             LIMIT 1`,
            [id],
        )

        if (!(rows as any[]).length) {
            return {
                code: 404,
                message: '评论不存在',
            }
        }

        const row = (rows as any[])[0]
        const data: GetCommentDetailResponse = {
            id: String(row.id ?? ''),
            face: String(row.face ?? ''),
            nickName: String(row.nickName ?? ''),
            createdAt: Number(row.created_at) || 0,
            content: String(row.content ?? ''),
            status: Number(row.status) as CommentStatusEnum,
            likeCount: Math.floor(Number(row.like_count) || 0),
            replyCount: Math.floor(Number(row.reply_count) || 0),
            pid: String(row.pid ?? ''),
            root: row.root != null ? String(row.root) : null,
            level: Math.floor(Number(row.level) || 0),
        }

        return {
            code: 200,
            message: 'ok',
            data,
        }
    }
    catch (error: any) {
        console.error('CMS 获取评论详情失败:', error)
        return {
            code: 500,
            message: '获取评论详情失败',
            error: error.message,
        }
    }
})
