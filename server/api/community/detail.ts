/**
 * 获取社区帖子详情 API
 * POST /api/community/detail
 */
import pool from '~/server/db/mysql'
import type { GetCommunityDetailParams, GetCommunityDetailResponse } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const body = await readBody<GetCommunityDetailParams>(event)

        if (!body?.id) {
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
                u_face,
                u_name,
                u_leavel,
                c_title,
                c_content,
                c_imgUrl,
                c_tag_type,
                c_tag_name,
                c_tag_url,
                likeCount,
                commentCount,
                collectCount,
                isLike,
                isCollect
            FROM community_detail
            WHERE id = ?
            LIMIT 1`,
            [body.id],
        )

        if (!(rows as any[]).length) {
            return {
                code: 404,
                message: '帖子不存在',
            }
        }

        const row = (rows as any[])[0]

        const detail: GetCommunityDetailResponse = {
            id: row.id,
            createTime: String(row.createTime),
            userInfo: {
                id: row.u_id,
                face: row.u_face || '',
                nickName: row.u_name || '',
                level: row.u_leavel || 0,
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
            isLike: row.isLike === 1,
            isCollect: row.isCollect === 1,
        }

        return {
            code: 200,
            message: '获取成功',
            data: detail,
        }
    }
    catch (error: any) {
        console.error('获取社区帖子详情失败:', error)
        return {
            code: 500,
            message: '获取社区帖子详情失败',
        }
    }
})
