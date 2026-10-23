/**
 * CMS 获取评论列表 API
 * 需验证 token 且为管理员；数据来自 comment
 * POST /api/cms/comment/list
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { CommentItem, GetCommentListParams } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'
import { CommentStatusEnum } from '~/types/community'

const VALID_COMMENT_STATUS = new Set<number>([
    CommentStatusEnum.PENDING,
    CommentStatusEnum.NORMAL,
    CommentStatusEnum.DELETED,
])

export default defineEventHandler(async event => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.ADMIN })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<GetCommentListParams>(event)
        const page = Math.max(1, Math.floor(Number(body?.page) || 1))
        const pageSize = Math.min(50, Math.max(1, Math.floor(Number(body?.pageSize) || 10)))
        const offset = (page - 1) * pageSize
        const search = body?.search?.trim()
        const status = body?.status

        const conditions: string[] = []
        const filterParams: unknown[] = []
        let orderBy = 'ORDER BY c.created_at DESC'
        const orderParams: unknown[] = []

        if (search) {
            conditions.push('(c.content LIKE ? OR c.id LIKE ?)')
            filterParams.push(`%${search}%`, `%${search}%`)
            // 搜索时优先展示命中正文的评论，再按时间倒序
            orderBy = 'ORDER BY CASE WHEN c.content LIKE ? THEN 0 ELSE 1 END, c.created_at DESC'
            orderParams.push(`%${search}%`)
        }

        if (status !== undefined && status !== null) {
            const s = Number(status)
            if (!VALID_COMMENT_STATUS.has(s)) {
                return {
                    code: 400,
                    message: 'status 参数不合法',
                }
            }
            conditions.push('c.status = ?')
            filterParams.push(s)
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total
             FROM comment c
             ${where}`,
            filterParams,
        )
        const total = Number((countRows as any[])[0]?.total ?? 0)

        const [rows] = await pool.query(
            `SELECT
                c.id,
                c.content,
                c.status,
                c.created_at,
                u.face,
                u.nickName
             FROM comment c
             LEFT JOIN user u ON u.uid = c.uid
             ${where}
             ${orderBy}
             LIMIT ? OFFSET ?`,
            [...filterParams, ...orderParams, pageSize, offset],
        )

        const list: CommentItem[] = (rows as any[]).map(row => ({
            id: String(row.id ?? ''),
            face: String(row.face ?? ''),
            nickName: String(row.nickName ?? ''),
            createdAt: Number(row.created_at) || 0,
            content: String(row.content ?? ''),
            status: Number(row.status) as CommentStatusEnum,
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
        console.error('CMS 获取评论列表失败:', error)
        return {
            code: 500,
            message: '获取评论列表失败',
            error: error.message,
        }
    }
})
