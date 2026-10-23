/**
 * 获取创作者帖子列表 API
 * GET /api/creator/list
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { ManageRequestParams } from '~/types/creator'

export default defineEventHandler(async (event) => {
    try {
        const authResult = await validateToken(event)
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<ManageRequestParams>(event)

        const page = Math.max(1, body.page || 1)
        const pageSize = Math.min(50, Math.max(1, body.pageSize || 10))
        const offset = (page - 1) * pageSize
        const { search, status } = body

        const conditions: string[] = ['u_id = ?']
        const params: any[] = [authResult.uid]

        if (search && search.trim().length > 0) {
            conditions.push('c_title LIKE ?')
            params.push(`%${search.trim()}%`)
        }

        if (status) {
            conditions.push('reviewStatus = ?')
            params.push(status)
        }

        const where = `WHERE ${conditions.join(' AND ')}`

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM community_review ${where}`,
            params,
        )
        const total = (countRows as any[])[0]?.total ?? 0

        const [rows] = await pool.query(
            `SELECT id, createTime, c_title AS title, c_desc AS \`desc\`, c_imgUrl AS cover,
                    likeCount, commentCount, collectCount, reviewStatus AS status
             FROM community_review
             ${where}
             ORDER BY createTime DESC
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset],
        )

        const list = (rows as any[]).map(row => ({
            id: row.id,
            createTime: row.createTime,
            title: row.title,
            desc: row.desc,
            cover: (row.cover || '').split(',')[0] || '',
            likeCount: row.likeCount,
            commentCount: row.commentCount,
            collectCount: row.collectCount,
            status: row.status,
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
        console.error('获取列表失败:', error)
        return {
            code: 500,
            message: '获取列表失败',
            error: error.message,
        }
    }
})
