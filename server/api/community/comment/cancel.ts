/**
 * 评论取消点赞 API
 * POST /api/community/comment/cancel
 *
 * 规则：
 * - 需要登录 + 正式会员及以上
 * - 必须已存在点赞关系且当前为已点赞，否则报错
 * - 取消点赞：更新 comment_like.status=0，并对 comment.like_count - 1（不减到负数）
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import { UserRoleEnum } from '~/types/cms'
import { LikeStatusEnum } from '~/types/community'
import type { LikeCommentParams } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.USER })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<LikeCommentParams>(event)
        const commentId = body?.id
        if (!commentId) {
            return { code: 400, message: '缺少必要参数 id' }
        }

        const uid = authResult.uid!

        // 必须存在点赞关系且为已点赞
        const [existRows] = await pool.query(
            'SELECT id, status FROM comment_like WHERE comment_id = ? AND uid = ? LIMIT 1',
            [commentId, uid],
        )
        const exist = (existRows as any[])[0]
        if (!exist) {
            return {
                code: 404,
                message: '未点赞，无法取消',
                data: {
                    status: LikeStatusEnum.NOT_LIKE,
                },
            }
        }
        if (Number(exist.status) !== 1) {
            return {
                code: 409,
                message: '未点赞，无法重复取消',
                data: {
                    status: LikeStatusEnum.NOT_LIKE,
                },
            }
        }

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const now = Date.now()

            // 取消点赞（幂等保护：仅在 status=1 时更新）
            const [updateLikeRes] = await connection.query(
                'UPDATE comment_like SET status = 0, updated = ? WHERE comment_id = ? AND uid = ? AND status = 1',
                [now, commentId, uid],
            )
            const affected = Number((updateLikeRes as any)?.affectedRows ?? 0)
            if (affected === 0) {
                await connection.rollback()
                return {
                    code: 409,
                    message: '未点赞，无法取消',
                    data: {
                        status: LikeStatusEnum.NOT_LIKE,
                    },
                }
            }

            // 点赞数 -1（不减成负数）
            await connection.query(
                'UPDATE comment SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?',
                [commentId],
            )

            await connection.commit()

            return {
                code: 200,
                message: '取消点赞成功',
                data: {
                    status: LikeStatusEnum.NOT_LIKE,
                },
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
        console.error('评论取消点赞失败:', error)
        return {
            code: 500,
            message: '评论取消点赞失败',
        }
    }
})
