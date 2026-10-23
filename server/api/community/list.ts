/**
 * 获取社区帖子列表 API
 * POST /api/community/list
 */
import pool from '~/server/db/mysql'
import type { GetCommunityListParams, GetCommunityListResponse } from '~/types/community'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        const body = await readBody<GetCommunityListParams>(event)

        const page = Math.max(1, Math.floor(Number(body?.page) || 1))
        const pageSize = Math.min(100, Math.max(1, Math.floor(Number(body?.pageSize) || 10)))
        const offset = (page - 1) * pageSize

        // 查询总数
        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM community_list`
        )
        const total = (countRows as any[])[0].total as number

        // 分页查询列表
        const [rows] = await pool.query(
            `SELECT
                id,
                createTime,
                u_id,
                u_face,
                u_name,
                u_leavel,
                c_title,
                c_desc,
                c_imgUrl,
                c_tag_type,
                c_tag_name,
                c_tag_url,
                likeCount,
                commentCount
            FROM community_list
            ORDER BY createTime DESC
            LIMIT ? OFFSET ?`,
            [pageSize, offset]
        )

        const list = (rows as any[]).map(row => ({
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
                desc: row.c_desc || '',
                imgUrl: row.c_imgUrl ? row.c_imgUrl.split(',') : [],
                tag: {
                    type: row.c_tag_type || '',
                    name: row.c_tag_name || '',
                    url: row.c_tag_url || '',
                },
            },
            likeCount: Math.floor(Number(row.likeCount) || 0),
            commentCount: Math.floor(Number(row.commentCount) || 0),
        })) satisfies GetCommunityListResponse['list']

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
            } satisfies GetCommunityListResponse,
        }
    }
    catch (error: any) {
        console.error('获取社区帖子列表失败:', error)
        return {
            code: 500,
            message: '获取社区帖子列表失败',
        }
    }
})
