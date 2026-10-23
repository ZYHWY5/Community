/**
 * CMS 审核帖子 API
 * 需验证 token，且当前用户须为管理员（review.userRole === ADMIN）
 * 通过：写入 community_list、community_detail（主键冲突则更新）
 * 拒绝：若 community_list / community_detail 存在则删除
 * 同步更新 community_review.reviewStatus
 * POST /api/cms/post/review
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { ReviewPostRequestParams } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'
import { ReviewStatusEnum } from '~/types/creator'

const VALID_REVIEW = new Set<number>([
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

        const body = await readBody<ReviewPostRequestParams>(event)
        const id = body?.id?.trim()
        if (!id) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const status = Number(body.reviewStatus)
        if (!VALID_REVIEW.has(status)) {
            return {
                code: 400,
                message: 'reviewStatus 参数不合法',
            }
        }

        const [reviewRows] = await pool.query(
            `SELECT id, createTime, u_id, c_title, c_desc, c_content, c_imgUrl, c_tag_type, c_tag_name, c_tag_url,
                    likeCount, commentCount, collectCount, isLike, isCollect
             FROM community_review
             WHERE id = ?
             LIMIT 1`,
            [id],
        )

        if (!(reviewRows as any[]).length) {
            return {
                code: 404,
                message: '帖子不存在',
            }
        }

        const row = (reviewRows as any[])[0]
        const uid = row.u_id != null ? String(row.u_id) : ''

        let uFace = ''
        let uName = ''
        let uLeavel = 0
        if (uid) {
            const [userRows] = await pool.query(
                'SELECT nickName, face, leavel FROM user WHERE uid = ? LIMIT 1',
                [uid],
            )
            const u = (userRows as any[])[0]
            if (u) {
                uFace = String(u.face ?? '')
                uName = String(u.nickName ?? '')
                uLeavel = Math.floor(Number(u.leavel) || 0)
            }
        }

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            await connection.query(
                'UPDATE community_review SET reviewStatus = ? WHERE id = ?',
                [status, id],
            )

            if (status === ReviewStatusEnum.APPROVED) {
                const createTime = row.createTime != null ? Number(row.createTime) : Date.now()
                const likeCount = Math.floor(Number(row.likeCount) || 0)
                const commentCount = Math.floor(Number(row.commentCount) || 0)
                const collectCount = Math.floor(Number(row.collectCount) || 0)
                const isLike = Math.floor(Number(row.isLike) || 0)
                const isCollect = Math.floor(Number(row.isCollect) || 0)

                await connection.query(
                    `INSERT INTO community_list
                        (id, createTime, u_id, u_face, u_name, u_leavel, c_title, c_desc, c_imgUrl, c_tag_type, c_tag_name, c_tag_url, likeCount, commentCount)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                        createTime = VALUES(createTime),
                        u_id = VALUES(u_id),
                        u_face = VALUES(u_face),
                        u_name = VALUES(u_name),
                        u_leavel = VALUES(u_leavel),
                        c_title = VALUES(c_title),
                        c_desc = VALUES(c_desc),
                        c_imgUrl = VALUES(c_imgUrl),
                        c_tag_type = VALUES(c_tag_type),
                        c_tag_name = VALUES(c_tag_name),
                        c_tag_url = VALUES(c_tag_url),
                        likeCount = VALUES(likeCount),
                        commentCount = VALUES(commentCount)`,
                    [
                        id,
                        createTime,
                        uid,
                        uFace,
                        uName,
                        uLeavel,
                        String(row.c_title ?? ''),
                        String(row.c_desc ?? ''),
                        String(row.c_imgUrl ?? ''),
                        String(row.c_tag_type ?? ''),
                        String(row.c_tag_name ?? ''),
                        String(row.c_tag_url ?? ''),
                        likeCount,
                        commentCount,
                    ],
                )

                await connection.query(
                    `INSERT INTO community_detail
                        (id, createTime, u_id, u_face, u_name, u_leavel, c_title, c_content, c_imgUrl, c_tag_type, c_tag_name, c_tag_url,
                         likeCount, commentCount, collectCount, isLike, isCollect)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                        createTime = VALUES(createTime),
                        u_id = VALUES(u_id),
                        u_face = VALUES(u_face),
                        u_name = VALUES(u_name),
                        u_leavel = VALUES(u_leavel),
                        c_title = VALUES(c_title),
                        c_content = VALUES(c_content),
                        c_imgUrl = VALUES(c_imgUrl),
                        c_tag_type = VALUES(c_tag_type),
                        c_tag_name = VALUES(c_tag_name),
                        c_tag_url = VALUES(c_tag_url),
                        likeCount = VALUES(likeCount),
                        commentCount = VALUES(commentCount),
                        collectCount = VALUES(collectCount),
                        isLike = VALUES(isLike),
                        isCollect = VALUES(isCollect)`,
                    [
                        id,
                        createTime,
                        uid,
                        uFace,
                        uName,
                        uLeavel,
                        String(row.c_title ?? ''),
                        String(row.c_content ?? ''),
                        String(row.c_imgUrl ?? ''),
                        String(row.c_tag_type ?? ''),
                        String(row.c_tag_name ?? ''),
                        String(row.c_tag_url ?? ''),
                        likeCount,
                        commentCount,
                        collectCount,
                        isLike,
                        isCollect,
                    ],
                )
            }
            else if (status === ReviewStatusEnum.REJECTED) {
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
        }
        catch (err) {
            await connection.rollback()
            throw err
        }
        finally {
            connection.release()
        }

        return {
            code: 200,
            message: 'ok',
        }
    }
    catch (error: any) {
        console.error('CMS 审核帖子失败:', error)
        return {
            code: 500,
            message: '审核帖子失败',
            error: error.message,
        }
    }
})
