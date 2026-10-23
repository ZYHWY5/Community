/**
 * 删除创作者帖子 API
 * POST /api/creator/delete
 *
 * 规则：
 * - 需要验证 token
 * - 仅允许删除自己的帖子
 * - 先查询 community_review.reviewStatus
 *   - 0（未审核）/ 2（拒绝）：仅删除 community_review
 *   - 1（通过）：同时删除 community_review、community_list、community_detail
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { DeleteRequestParams } from '~/types/creator'
import { ReviewStatusEnum } from '~/types/creator'

export default defineEventHandler(async (event) => {
    try {
        const authResult = await validateToken(event)
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<DeleteRequestParams>(event)
        const id = body?.id?.trim()
        if (!id) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const [reviewRows] = await pool.query(
            'SELECT id, u_id, reviewStatus FROM community_review WHERE id = ? LIMIT 1',
            [id],
        )
        const review = (reviewRows as any[])[0]
        if (!review) {
            return {
                code: 404,
                message: '帖子不存在',
            }
        }

        const uid = authResult.uid ?? ''
        if (String(review.u_id ?? '') !== uid) {
            return {
                code: 403,
                message: '无权删除他人帖子',
            }
        }

        const status = Number(review.reviewStatus)
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            await connection.query('DELETE FROM community_review WHERE id = ?', [id])

            if (status === ReviewStatusEnum.APPROVED) {
                await connection.query('DELETE FROM community_list WHERE id = ?', [id])
                await connection.query('DELETE FROM community_detail WHERE id = ?', [id])
            }

            await connection.commit()

            return {
                code: 200,
                message: '删除成功',
                data: { id },
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
        console.error('删除帖子失败:', error)
        return {
            code: 500,
            message: '删除帖子失败',
            error: error.message,
        }
    }
})
