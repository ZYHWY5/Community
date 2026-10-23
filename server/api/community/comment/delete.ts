/**
 * 删除评论 API（软删除）
 * POST /api/community/comment/delete
 *
 * 规则：
 * - 需要登录 + 正式会员及以上
 * - 仅评论发布者可删除
 * - 将 status 更新为 2，并同步帖子 commentCount、一级评论 reply_count（与发布评论时 +1 对称）
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import { UserRoleEnum } from '~/types/cms'
import type { DeleteCommentParams } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.USER })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<DeleteCommentParams>(event)
        const commentId = body?.id
        if (!commentId) {
            return { code: 400, message: '缺少必要参数 id' }
        }

        const uid = authResult.uid!

        const [rows] = await pool.query(
            'SELECT id, uid, pid, level, root, status FROM comment WHERE id = ? LIMIT 1',
            [commentId],
        )
        const row = (rows as any[])[0]
        if (!row) {
            return { code: 404, message: '评论不存在' }
        }
        if (String(row.uid) !== uid) {
            return { code: 403, message: '无权删除他人评论' }
        }
        if (Number(row.status) !== 1) {
            return { code: 409, message: '评论已删除' }
        }

        const pid = String(row.pid ?? '')
        const level = Number(row.level) || 1
        const root = row.root != null ? String(row.root) : ''
        const isReply = level >= 2

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const [updateRes] = await connection.query(
                'UPDATE comment SET status = 2 WHERE id = ? AND uid = ? AND status = 1',
                [commentId, uid],
            )
            const affected = Number((updateRes as any)?.affectedRows ?? 0)
            if (affected === 0) {
                await connection.rollback()
                return { code: 409, message: '评论已删除' }
            }

            if (isReply && root) {
                await connection.query(
                    'UPDATE comment SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = ?',
                    [root],
                )
            }

            if (pid) {
                await connection.query(
                    'UPDATE community_detail SET commentCount = GREATEST(commentCount - 1, 0) WHERE id = ?',
                    [pid],
                )
                await connection.query(
                    'UPDATE community_list SET commentCount = GREATEST(commentCount - 1, 0) WHERE id = ?',
                    [pid],
                )
            }

            await connection.commit()

            return {
                code: 200,
                message: '删除成功',
                data: {
                    id: commentId,
                    status: 2,
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
        console.error('删除评论失败:', error)
        return {
            code: 500,
            message: '删除评论失败',
        }
    }
})
