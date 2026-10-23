/**
 * 获取创作者帖子详情 API
 * POST /api/creator/detail
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetPostDetailRequestParams, GetPostDetailResponse } from '~/types/creator'

export default defineEventHandler(async (event) => {
    try {
        const authResult = await validateToken(event)
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<GetPostDetailRequestParams>(event)
        const id = body?.id?.trim()
        if (!id) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const [rows] = await pool.query(
            `SELECT id, u_id, c_imgUrl, c_title, c_desc, c_content
             FROM community_review
             WHERE id = ?
             LIMIT 1`,
            [id],
        )

        const row = (rows as any[])[0]
        if (!row) {
            return {
                code: 404,
                message: '帖子不存在',
            }
        }

        if (String(row.u_id ?? '') !== String(authResult.uid ?? '')) {
            return {
                code: 403,
                message: '无权查看他人帖子',
            }
        }

        const data: GetPostDetailResponse = {
            id: String(row.id ?? ''),
            cover: String(row.c_imgUrl ?? '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean),
            title: String(row.c_title ?? ''),
            desc: String(row.c_desc ?? ''),
            content: String(row.c_content ?? ''),
        }

        return {
            code: 200,
            message: 'ok',
            data,
        }
    }
    catch (error: any) {
        console.error('获取创作者帖子详情失败:', error)
        return {
            code: 500,
            message: '获取帖子详情失败',
            error: error.message,
        }
    }
})
