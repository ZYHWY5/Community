/**
 * 更新用户信息 API
 * POST /api/user/update
 * 需要验证 token，更新用户的昵称、头像等信息
 * 请求体参数：nickName（可选）、face（可选）、phone（可选）、password（可选）
 * 返回数据：更新后的用户信息
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        // 验证 token
        const tokenValidation = await validateToken(event)

        if (!tokenValidation.success) {
            return {
                code: tokenValidation.code,
                message: tokenValidation.message
            }
        }

        const { uid } = tokenValidation

        // 获取请求体
        const body = await readBody<{
            nickName?: string
            face?: string
            phone?: string
        }>(event)

        const { nickName, face, phone } = body || {}

        // 至少需要有一个字段可更新
        if (!nickName && !face && !phone) {
            return {
                code: 400,
                message: '请提供至少一个需要更新的字段'
            }
        }

        // 动态构建 UPDATE 语句
        const fields: string[] = []
        const values: any[] = []

        if (nickName !== undefined) {
            fields.push('nickName = ?')
            values.push(nickName)
        }

        if (face !== undefined) {
            fields.push('face = ?')
            values.push(face)
        }

        if (phone !== undefined) {
            fields.push('phone = ?')
            values.push(phone)
        }

        values.push(uid)

        // 执行更新
        await pool.query(
            `UPDATE user SET ${fields.join(', ')} WHERE uid = ?`,
            values
        )

        // nickName 变更时同步到 review 表
        if (nickName !== undefined) {
            await pool.query(
                'UPDATE review SET nickName = ? WHERE uid = ?',
                [nickName, uid]
            )
        }

        // 只返回实际传入并更新的字段
        const userInfo: Record<string, string> = {}
        if (nickName !== undefined) userInfo.nickName = nickName
        if (face !== undefined) userInfo.face = face
        if (phone !== undefined) userInfo.phone = phone

        return {
            code: 200,
            message: '更新成功',
            data: userInfo
        }
    }
    catch (error: any) {
        console.error('更新用户信息失败:', error)
        return {
            code: 500,
            message: '更新用户信息失败'
        }
    }
})
