/**
 * CMS 获取帖子详情 API
 * 需验证 token 且为管理员；数据来自 community_review；响应结构同 GetCommunityDetailResponse
 * POST /api/cms/post/detail
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { GetPostDetailParams, GetPostDetailResponse } from '~/types/cms'
import { UserRoleEnum } from '~/types/cms'

export default defineEventHandler(async event => {
    try {
        const authResult = await validateToken(event, { requiredRole: UserRoleEnum.ADMIN })
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<GetPostDetailParams>(event)
        if (!body?.id?.trim()) {
            return {
                code: 400,
                message: '缺少必要参数 id',
            }
        }

        const [rows] = await pool.query(
            `SELECT
                id,
                createTime,
                u_id,
                c_title,
                c_content,
                c_imgUrl,
                c_tag_type,
                c_tag_name,
                c_tag_url,
                likeCount,
                commentCount,
                collectCount,
                reviewStatus,
                isLike,
                isCollect
            FROM community_review
            WHERE id = ?
            LIMIT 1`,
            [body.id.trim()],
        )

        if (!(rows as any[]).length) {
            return {
                code: 404,
                message: '帖子不存在',
            }
        }

        const row = (rows as any[])[0]
        const authorUid = row.u_id != null ? String(row.u_id) : ''

        let face = ''
        let nickName = ''
        let level = 0
        if (authorUid) {
            const [userRows] = await pool.query(
                'SELECT nickName, face, leavel FROM user WHERE uid = ? LIMIT 1',
                [authorUid],
            )
            const u = (userRows as any[])[0]
            if (u) {
                face = String(u.face ?? '')
                nickName = String(u.nickName ?? '')
                level = Math.floor(Number(u.leavel) || 0)
            }
        }

        const data: GetPostDetailResponse = {
            id: row.id,
            createTime: String(row.createTime),
            userInfo: {
                id: authorUid,
                face,
                nickName,
                level,
            },
            content: {
                title: row.c_title || '',
                content: row.c_content || '',
                imgUrl: row.c_imgUrl ? row.c_imgUrl.split(',') : [],
                tag: {
                    type: row.c_tag_type || '',
                    name: row.c_tag_name || '',
                    url: row.c_tag_url || '',
                },
            },
            likeCount: Math.floor(Number(row.likeCount) || 0),
            commentCount: Math.floor(Number(row.commentCount) || 0),
            collectCount: Math.floor(Number(row.collectCount) || 0),
            reviewStatus: Number(row.reviewStatus),
            isLike: row.isLike === 1,
            isCollect: row.isCollect === 1,
        }

        return {
            code: 200,
            message: 'ok',
            data,
        }
    }
    catch (error: any) {
        console.error('CMS 获取帖子详情失败:', error)
        return {
            code: 500,
            message: '获取帖子详情失败',
            error: error.message,
        }
    }
})
