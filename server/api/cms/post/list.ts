/**
 * CMS 获取帖子列表 API
 * 需验证 token 且为管理员；数据来自 community_review
 * POST /api/cms/post/list
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetPostListParams } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'
import type { ManageResponseParams } from '~/types/creator'
import { ReviewStatusEnum } from '~/types/creator'

const VALID_REVIEW_STATUS = new Set<number>([
    ReviewStatusEnum.PENDING,
    ReviewStatusEnum.APPROVED,
    ReviewStatusEnum.REJECTED,
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

        const body = await readBody<GetPostListParams>(event)
        const page = Math.max(1, body.page ?? 1)
        const pageSize = Math.min(50, Math.max(1, body.pageSize ?? 10))
        const offset = (page - 1) * pageSize
        const { search, status } = body

        const conditions: string[] = []
        const params: unknown[] = []

        if (search?.trim()) {
            conditions.push('c_title LIKE ?')
            params.push(`%${search.trim()}%`)
        }
        if (status !== undefined && status !== null) {
            const s = Number(status)
            if (!VALID_REVIEW_STATUS.has(s)) {
                return {
                    code: 400,
                    message: 'status 参数不合法',
                }
            }
            conditions.push('reviewStatus = ?')
            params.push(s)
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM community_review ${where}`,
            params,
        )
        const total = Number((countRows as any[])[0]?.total ?? 0)

        const [rows] = await pool.query(
            `SELECT id, createTime, c_title AS title, c_imgUrl AS cover,
                    likeCount, commentCount, collectCount, reviewStatus AS status
             FROM community_review
             ${where}
             ORDER BY createTime DESC
             LIMIT ? OFFSET ?`,
            [...params, pageSize, offset],
        )

        const list: ManageResponseParams[] = (rows as any[]).map(row => ({
            id: String(row.id ?? ''),
            cover: (row.cover || '').split(',')[0] || '',
            title: String(row.title ?? ''),
            status: Number(row.status) as ReviewStatusEnum,
            createTime: String(row.createTime ?? ''),
            likeCount: Math.floor(Number(row.likeCount) || 0),
            commentCount: Math.floor(Number(row.commentCount) || 0),
            collectCount: Math.floor(Number(row.collectCount) || 0),
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
        console.error('CMS 获取帖子列表失败:', error)
        return {
            code: 500,
            message: '获取帖子列表失败',
            error: error.message,
        }
    }
})
