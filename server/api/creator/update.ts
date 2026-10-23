/**
 * 更新创作者帖子 API
 * POST /api/creator/update
 *
 * 规则：
 * - 需要验证 token
 * - 仅允许更新自己的帖子
 * - 始终更新传入字段
 * - reviewStatus:
 *   - 0（未审核）：保持不变
 *   - 2（拒绝）：改为 0
 *   - 1（通过）：改为 0，并删除 community_list / community_detail 对应记录
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { UpdatePostRequestParams, UpdatePostResponse } from '~/types/creator'
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

        const body = await readBody<UpdatePostRequestParams>(event)
        const id = body?.id?.trim()
        const title = body?.title?.trim()
        const desc = body?.desc?.trim()
        const content = body?.content?.trim()
        const resourceList = body?.resourceList ?? []

        if (!id) {
            return { code: 400, message: '缺少必要参数 id' }
        }
        if (!title) {
            return { code: 400, message: '标题不能为空' }
        }
        if (!desc) {
            return { code: 400, message: '简介不能为空' }
        }
        if (!content) {
            return { code: 400, message: '正文不能为空' }
        }
        if (!resourceList.length) {
            return { code: 400, message: '封面不能为空' }
        }

        const [reviewRows] = await pool.query(
            'SELECT id, u_id, reviewStatus FROM community_review WHERE id = ? LIMIT 1',
            [id],
        )
        const review = (reviewRows as any[])[0]
        if (!review) {
            return { code: 404, message: '帖子不存在' }
        }

        const uid = authResult.uid ?? ''
        if (String(review.u_id ?? '') !== uid) {
            return { code: 403, message: '无权更新他人帖子' }
        }

        const cImgUrl = resourceList.map(item => item.fileUrl).join(',')
        const status = Number(review.reviewStatus)
        let nextStatus = status
        if (status === ReviewStatusEnum.APPROVED || status === ReviewStatusEnum.REJECTED) {
            nextStatus = ReviewStatusEnum.PENDING
        }

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            await connection.query(
                `UPDATE community_review
                 SET c_title = ?, c_desc = ?, c_content = ?, c_imgUrl = ?, reviewStatus = ?
                 WHERE id = ?`,
                [title, desc, content, cImgUrl, nextStatus, id],
            )

            if (status === ReviewStatusEnum.APPROVED) {
                const [listRows] = await connection.query(
                    'SELECT id FROM community_list WHERE id = ? LIMIT 1',
                    [id],
                )
                if ((listRows as any[]).length) {
                    await connection.query('DELETE FROM community_list WHERE id = ?', [id])
                }

                const [detailRows] = await connection.query(
                    'SELECT id FROM community_detail WHERE id = ? LIMIT 1',
                    [id],
                )
                if ((detailRows as any[]).length) {
                    await connection.query('DELETE FROM community_detail WHERE id = ?', [id])
                }
            }

            await connection.commit()

            const data: UpdatePostResponse = {
                id,
                resourceList,
                title,
                reviewStatus: nextStatus,
            }

            return {
                code: 200,
                message: '更新成功，等待审核',
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
        console.error('更新帖子失败:', error)
        return {
            code: 500,
            message: '更新帖子失败',
            error: error.message,
        }
    }
})
