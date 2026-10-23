/**
 * 获取二级评论列表 API
 * POST /api/community/comment/detail
 */
import pool from '~/server/db/mysql'
import type { GetSubCommentListParams } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const body = await readBody<GetSubCommentListParams>(event)

        if (!body?.root) {
            return {
                code: 400,
                message: '缺少必要参数 root',
            }
        }

        const page = Math.max(1, Math.floor(Number(body?.page) || 1))
        const pageSize = Math.min(100, Math.max(1, Math.floor(Number(body?.pageSize) || 10)))
        const offset = (page - 1) * pageSize

        /** root 为一级评论 id；二级、三级回复的 root 相同，用 level 区分 */
        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM comment
             WHERE root = ? AND level >= 2 AND status = 1`,
            [body.root],
        )
        const total = (countRows as any[])[0].total as number

        const [rows] = await pool.query(
            `SELECT
                c.id,
                c.uid,
                c.pid,
                c.level,
                c.root,
                c.reply_uid,
                c.content,
                c.status,
                c.like_count,
                c.reply_count,
                c.created_at,
                u.nickName   AS u_nickName,
                u.face       AS u_face,
                u.leavel     AS u_level,
                ru.nickName  AS r_nickName,
                ru.face      AS r_face
            FROM comment c
            LEFT JOIN user u  ON u.uid  = c.uid
            LEFT JOIN user ru ON ru.uid = c.reply_uid
            WHERE c.root = ? AND c.level >= 2 AND c.status = 1
            ORDER BY c.created_at ASC
            LIMIT ? OFFSET ?`,
            [body.root, pageSize, offset],
        )

        const secondComments = (rows as any[]).map(row => ({
            id: row.id,
            uid: row.uid,
            pid: row.pid,
            level: row.level,
            root: row.root ?? null,
            replyUid: row.reply_uid ?? null,
            content: row.content || '',
            status: row.status,
            likeCount: Math.floor(Number(row.like_count) || 0),
            replyCount: Math.floor(Number(row.reply_count) || 0),
            createdAt: Number(row.created_at) || 0,
            userInfo: {
                id: row.uid,
                avatar: row.u_face || '',
                nickName: row.u_nickName || '',
                level: row.u_level || 0,
            },
            replyUserInfo: row.reply_uid
                ? {
                    id: row.reply_uid,
                    nickName: row.r_nickName || '',
                }
                : null,
        }))

        return {
            code: 200,
            message: '获取成功',
            data: {
                list: secondComments,
                paginator: {
                    total,
                    page,
                    pageSize,
                },
            },
        }
    }
    catch (error: any) {
        console.error('获取二级评论失败:', error)
        return {
            code: 500,
            message: '获取二级评论失败',
        }
    }
})
