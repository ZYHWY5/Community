/**
 * 发布内容 API
 * POST /api/creator/post
 */
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { PostRequestParams } from '~/types/creator'

export default defineEventHandler(async (event) => {
    try {
        // 验证 token
        const authResult = await validateToken(event)
        if (!authResult.success) {
            return {
                code: authResult.code ?? 401,
                message: authResult.message,
            }
        }

        const body = await readBody<PostRequestParams>(event)
        const { resourceList, title, desc, content } = body

        // 参数验证
        if (!title || title.trim().length === 0) {
            return { code: 400, message: '标题不能为空' }
        }
        if (!desc || desc.trim().length === 0) {
            return { code: 400, message: '简介不能为空' }
        }
        if (!content || content.trim().length === 0) {
            return { code: 400, message: '正文不能为空' }
        }
        if (!resourceList || resourceList.length === 0) {
            return { code: 400, message: '封面不能为空' }
        }

        // 通过 token 中的 uid 查询用户信息
        const [users] = await pool.query(
            `SELECT uid, nickName, face, leavel FROM user WHERE uid = ? LIMIT 1`,
            [authResult.uid]
        )

        if (!Array.isArray(users) || users.length === 0) {
            return { code: 404, message: '用户不存在' }
        }

        const user = users[0] as {
            uid: string
            nickName: string
            face: string
            leavel: number
        }

        // 图片 URL 数组转逗号分隔字符串
        const cImgUrl = (resourceList ?? []).map(f => f.fileUrl).join(',')

        const id = nanoid(20)
        const createTime = Date.now()

        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            // // 插入 community_list 表
            // await connection.query(
            //     `INSERT INTO community_list
            //         (id, createTime, u_id, u_face, u_name, u_leavel, c_title, c_desc, c_imgUrl, likeCount, commentCount)
            //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
            //     [id, createTime, user.uid, user.face, user.nickName, user.leavel, title, desc, cImgUrl]
            // )

            // // 插入 community_detail 表
            // await connection.query(
            //     `INSERT INTO community_detail
            //         (id, createTime, u_id, u_face, u_name, u_leavel, c_title, c_content, c_imgUrl, likeCount, commentCount, collectCount, isLike, isCollect)
            //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0)`,
            //     [id, createTime, user.uid, user.face, user.nickName, user.leavel, title, content, cImgUrl]
            // )

            // 插入 community_review 审核表
            await connection.query(
                `INSERT INTO community_review
                    (id, createTime, u_id, u_face, u_name, u_leavel, c_title, c_desc, c_content, c_imgUrl, likeCount, commentCount, collectCount, isLike, isCollect, reviewStatus)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0)`,
                [id, createTime, user.uid, user.face, user.nickName, user.leavel, title, desc, content, cImgUrl]
            )

            await connection.commit()

            return {
                code: 200,
                message: '发布成功，等待审核',
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
        console.error('发布失败:', error)
        return {
            code: 500,
            message: '发布失败',
            error: error.message,
        }
    }
})
