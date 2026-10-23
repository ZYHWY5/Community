/**
 * 查询用户信息 API
 * POST /api/user/profile
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

        const { uid, token } = tokenValidation

        // 根据 uid 查询用户完整信息
        const [users] = await pool.query(
            `SELECT 
                uid,
                nickName,
                email,
                phone,
                userRole,
                face,
                token,
                lastLogin
            FROM user 
            WHERE uid = ? 
            LIMIT 1`,
            [uid]
        )

        if (!Array.isArray(users) || users.length === 0) {
            return {
                code: 404,
                message: '用户不存在'
            }
        }

        const user = users[0] as any

        // 构建返回数据（与 GetUserInfoResponse 类型对应）
        const userInfo = {
            uid: user.uid,
            nickName: user.nickName,
            email: user.email,
            phone: user.phone,
            userRole: user.userRole,
            face: user.face,
            token: token, // 使用验证通过的 token
            lastLogin: user.lastLogin
        }

        return {
            code: 200,
            message: '查询成功',
            data: userInfo
        }
    }
    catch (error: any) {
        console.error('查询用户信息失败:', error)
        return {
            code: 500,
            message: '查询用户信息失败'
        }
    }
})
