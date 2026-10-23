/**
 * 获取一级评论列表 API
 * POST /api/community/comment/list
 */
import pool from '~/server/db/mysql'
import { LikeStatusEnum } from '~/types/community'
import type { GetCommentListParams, GetCommentListResponse } from '~/types/community'
import { validateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const body = await readBody<GetCommentListParams>(event)

        if (!body?.pid) {
            return {
                code: 400,
                message: '缺少必要参数 pid',
            }
        }

        const page = Math.max(1, Math.floor(Number(body?.page) || 1))
        const pageSize = Math.min(100, Math.max(1, Math.floor(Number(body?.pageSize) || 10)))
        const offset = (page - 1) * pageSize

        // 查询一级评论总数
        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM comment
             WHERE pid = ? AND level = 1 AND status = 1`,
            [body.pid],
        )
        const total = (countRows as any[])[0].total as number

        // 分页查询一级评论，同时 JOIN user 表获取用户信息
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
                u.nickName  AS u_nickName,
                u.face      AS u_face,
                u.leavel    AS u_level
            FROM comment c
            LEFT JOIN user u ON u.uid = c.uid
            WHERE c.pid = ? AND c.level = 1 AND c.status = 1
            ORDER BY c.created_at DESC
            LIMIT ? OFFSET ?`,
            [body.pid, pageSize, offset],
        )

        // 可选登录态：仅用于返回一级评论的 likeStatus（未登录则保持 null）
        const authResult = await validateToken(event)
        const likeUid = authResult.success ? authResult.uid : undefined

        const firstComments = (rows as any[]).map(row => ({
            id: row.id,
            uid: row.uid,
            pid: row.pid,
            level: row.level,
            root: row.root ?? null,
            replyUid: row.reply_uid ?? null,
            content: row.content || '',
            status: row.status,
            likeCount: Math.floor(Number(row.like_count) || 0),
            likeStatus: null as LikeStatusEnum | null,
            replyCount: Math.floor(Number(row.reply_count) || 0),
            createdAt: Number(row.created_at) || 0,
            userInfo: {
                id: row.uid,
                avatar: row.u_face || '',
                nickName: row.u_nickName || '',
                level: row.u_level || 0,
            },
            replyUserInfo: null,
        }))

        // 批量查询每条一级评论下前 3 条回复（二级 level=2、三级 level=3 的 root 均为一级评论 id）
        const firstCommentIds = firstComments.map(c => c.id)
        const secondCommentsMap = new Map<string, any[]>()

        // 一级评论：查询当前用户是否点赞（仅查 comment_like）
        if (likeUid && firstCommentIds.length > 0) {
            const placeholders = firstCommentIds.map(() => '?').join(', ')
            const [likeRows] = await pool.query(
                `SELECT comment_id FROM comment_like
                 WHERE uid = ? AND status = 1 AND comment_id IN (${placeholders})`,
                [likeUid, ...firstCommentIds],
            )
            const likedSet = new Set<string>((likeRows as any[]).map(r => String(r.comment_id)))
            for (const fc of firstComments) {
                fc.likeStatus = likedSet.has(fc.id) ? LikeStatusEnum.LIKED : LikeStatusEnum.NOT_LIKE
            }
        }

        if (firstCommentIds.length > 0) {
            const placeholders = firstCommentIds.map(() => '?').join(', ')
            const [subRows] = await pool.query(
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
                    ru.nickName  AS r_nickName
                FROM (
                    SELECT *, ROW_NUMBER() OVER (PARTITION BY root ORDER BY created_at ASC) AS rn
                    FROM comment
                    WHERE root IN (${placeholders}) AND level >= 2 AND status = 1
                ) c
                LEFT JOIN user u  ON u.uid  = c.uid
                LEFT JOIN user ru ON ru.uid = c.reply_uid
                WHERE c.rn <= 3`,
                firstCommentIds,
            )

            for (const row of subRows as any[]) {
                const group = secondCommentsMap.get(row.root) ?? []
                group.push({
                    id: row.id,
                    uid: row.uid,
                    pid: row.pid,
                    level: row.level,
                    root: row.root ?? null,
                    replyUid: row.reply_uid ?? null,
                    content: row.content || '',
                    status: row.status,
                    likeCount: Math.floor(Number(row.like_count) || 0),
                    likeStatus: null as LikeStatusEnum | null,
                    replyCount: Math.floor(Number(row.reply_count) || 0),
                    createdAt: Number(row.created_at) || 0,
                    userInfo: {
                        id: row.uid,
                        avatar: row.u_face || '',
                        nickName: row.u_nickName || '',
                        level: row.u_level || 0,
                    },
                    replyUserInfo: row.reply_uid
                        ? { id: row.reply_uid, nickName: row.r_nickName || '' }
                        : null,
                })
                secondCommentsMap.set(row.root, group)
            }
        }

        const list = firstComments.map(fc => ({
            firstComment: fc,
            secondComments: secondCommentsMap.get(fc.id) ?? [],
        })) satisfies GetCommentListResponse['list']

        return {
            code: 200,
            message: '获取成功',
            data: {
                list,
                paginator: {
                    total,
                    page,
                    pageSize,
                },
            } satisfies GetCommentListResponse,
        }
    }
    catch (error: any) {
        console.error('获取评论列表失败:', error)
        return {
            code: 500,
            message: '获取评论列表失败',
        }
    }
})
