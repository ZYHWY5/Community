/**
 * 评论点赞 API
 * POST /api/community/comment/like
 *
 * 规则：
 * - 需要登录 + 正式会员及以上
 * - 先查 comment_like 是否已存在 (comment_id + uid)
 *   - 存在：直接返回
 *   - 不存在：创建关系，并对 comment.like_count + 1
 */
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import { LikeStatusEnum } from '~/types/community'
import type { LikeCommentParams } from '~/types/community'
import { UserRoleEnum } from '~/types/cms'

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

        // 先查是否已有点赞关系
        const [existRows] = await pool.query(
            'SELECT id, status FROM comment_like WHERE comment_id = ? AND uid = ? LIMIT 1',
            [commentId, uid],
        )
        const exist = (existRows as any[])[0]
        if (exist) {
            const status = Math.floor(Number(exist.status) || 0)
            if (status === 1) {
                return {
                    code: 409,
                    message: '已点赞，请勿重复点赞',
                    data: {
                        status: LikeStatusEnum.LIKED,
                    },
                }
            }

            // status=0：恢复为已点赞 + like_count + 1（原子性）
            const connection = await pool.getConnection()
            try {
                await connection.beginTransaction()

                const now = Date.now()
                const [updateRes] = await connection.query(
                    'UPDATE comment_like SET status = 1, updated = ? WHERE comment_id = ? AND uid = ? AND status = 0',
                    [now, commentId, uid],
                )
                const affected = Number((updateRes as any)?.affectedRows ?? 0)
                if (affected === 0) {
                    await connection.rollback()
                    return {
                        code: 409,
                        message: '已点赞，请勿重复点赞',
                        data: {
                            status: LikeStatusEnum.LIKED,
                        },
                    }
                }

                await connection.query(
                    'UPDATE comment SET like_count = like_count + 1 WHERE id = ?',
                    [commentId],
                )

                await connection.commit()
                return {
                    code: 200,
                    message: '点赞成功',
                    data: {
                        status: LikeStatusEnum.LIKED,
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

        // 不存在：创建点赞关系 + 更新 comment.like_count（原子性）
        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            // 校验评论存在且可点赞（防止对不存在的评论刷数据）
            const [commentRows] = await connection.query(
                'SELECT id FROM comment WHERE id = ? AND status = 1 LIMIT 1',
                [commentId],
            )
            if (!(commentRows as any[]).length) {
                await connection.rollback()
                return { code: 404, message: '评论不存在或已删除' }
            }

            const now = Date.now()
            await connection.query(
                `INSERT INTO comment_like
                    (id, uid, comment_id, status, created, updated)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nanoid(20), uid, commentId, 1, now, now],
            )

            await connection.query(
                'UPDATE comment SET like_count = like_count + 1 WHERE id = ?',
                [commentId],
            )

            await connection.commit()

            return {
                code: 200,
                message: '点赞成功',
                data: {
                    status: LikeStatusEnum.LIKED,
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
        console.error('评论点赞失败:', error)
        return {
            code: 500,
            message: '评论点赞失败',
        }
    }
})
