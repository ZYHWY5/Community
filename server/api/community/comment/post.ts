/**
 * 发布评论 API
 * POST /api/community/comment/post
 */
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import { UserRoleEnum } from '~/types/cms'
import type { PostCommentParams } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        // 验证 token（仅校验登录态）
        const authResult = await validateToken(event)
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        // 校验角色：正式会员及以上（userRole >= 1）
        const [reviewRows] = await pool.query(
            'SELECT userRole FROM review WHERE uid = ? LIMIT 1',
            [authResult.uid],
        )
        const reviewRow = (reviewRows as any[])[0]
        const userRole = reviewRow != null ? Number(reviewRow.userRole) : NaN

        if (Number.isNaN(userRole) || userRole < UserRoleEnum.USER) {
            return {
                code: 403,
                message: '无权限，仅正式会员及以上可发布评论',
            }
        }

        const body = await readBody<PostCommentParams>(event)
        const { pid, content, root, replyUid, level: levelFromBody } = body

        // 参数校验
        if (!pid) {
            return { code: 400, message: '缺少必要参数 pid' }
        }
        if (!content || content.trim().length === 0) {
            return { code: 400, message: '评论内容不能为空' }
        }

        // 无被回复用户：一级评论 level=1；有 replyUid：使用请求体传入的 level
        const level = replyUid ? (Number(levelFromBody) || 1) : 1

        // 一级：校验帖子是否存在；2/3 级：校验父评论是否存在（root 为父评论 id）
        if (level === 1) {
            const [postRows] = await pool.query(
                'SELECT id FROM community_list WHERE id = ? LIMIT 1',
                [pid],
            )
            if (!(postRows as any[]).length) {
                return { code: 404, message: '帖子不存在' }
            }
        }
        else {
            if (!root) {
                return { code: 400, message: '缺少父评论 root' }
            }
            /** 2/3 级评论的 root 均为所属一级评论 id（与二级相同），只校验该一级评论存在 */
            const [parentRows] = await pool.query(
                'SELECT id FROM comment WHERE id = ? AND level = 1 AND status = 1 LIMIT 1',
                [root],
            )
            if (!(parentRows as any[]).length) {
                return { code: 404, message: '父级评论不存在或已删除' }
            }
        }

        /** 非一级评论：需要更新父评论 reply_count */
        const isReply = level >= 2

        const id = nanoid(20)
        const createdAt = Date.now()

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            // 插入评论
            await connection.query(
                `INSERT INTO comment
                    (id, uid, pid, level, root, reply_uid, content, status, like_count, reply_count, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?)`,
                [
                    id,
                    authResult.uid,
                    pid,
                    level,
                    root ?? null,
                    replyUid ?? null,
                    content.trim(),
                    createdAt,
                ],
            )

            if (isReply && root) {
                await connection.query(
                    'UPDATE comment SET reply_count = reply_count + 1 WHERE id = ?',
                    [root],
                )
            }

            // 更新帖子的 commentCount + 1
            await connection.query(
                'UPDATE community_detail SET commentCount = commentCount + 1 WHERE id = ?',
                [pid],
            )
            await connection.query(
                'UPDATE community_list SET commentCount = commentCount + 1 WHERE id = ?',
                [pid],
            )

            await connection.commit()

            // 查询发布者用户信息
            const [userRows] = await connection.query(
                'SELECT uid, nickName, face, leavel FROM user WHERE uid = ? LIMIT 1',
                [authResult.uid],
            )
            const user = (userRows as any[])[0] ?? {}

            const data: Record<string, unknown> = {
                id,
                uid: authResult.uid!,
                pid,
                level,
                root: root ?? null,
                replyUid: replyUid ?? null,
                content: content.trim(),
                status: 1,
                likeCount: 0,
                replyCount: 0,
                createdAt,
                userInfo: {
                    id: authResult.uid!,
                    avatar: user.face || '',
                    nickName: user.nickName || '',
                    level: user.leavel || 0,
                },
            }

            if (replyUid) {
                const [replyUserRows] = await connection.query(
                    'SELECT uid, nickName FROM user WHERE uid = ? LIMIT 1',
                    [replyUid],
                )
                const replyRow = (replyUserRows as any[])[0]
                if (replyRow) {
                    data.replyUserInfo = {
                        id: replyUid,
                        nickName: String(replyRow.nickName || ''),
                    }
                }
            }

            return {
                code: 200,
                message: '评论成功',
                data,
            }
        }
        catch (error) {
            await connection.rollback()
            throw error
        }
        finally {
            connection.release()
        }
    }
    catch (error: any) {
        console.error('发布评论失败:', error)
        return {
            code: 500,
            message: '发布评论失败',
        }
    }
})
