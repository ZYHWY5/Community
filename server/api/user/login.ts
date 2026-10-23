/**
 * 用户登录 API
 * POST /api/user/login
 */
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'
import type { LoginRequestParam } from '~/types/login'

export default defineEventHandler(async (event): Promise<any> => {
    try {
        // 获取请求体
        const body = await readBody<LoginRequestParam>(event)
        const { email, phone, password } = body

        // 参数验证
        if (!password || password.length === 0) {
            return {
                code: 400,
                message: '密码不能为空'
            }
        }

        if (!email && !phone) {
            return {
                code: 400,
                message: '请提供邮箱或手机号'
            }
        }

        // 邮箱格式验证
        if (email) {
            const emailReg = /.+@.+/
            if (!emailReg.test(email)) {
                return {
                    code: 400,
                    message: '邮箱格式不正确'
                }
            }
        }

        // 手机号格式验证（中国手机号）
        // if (phone) {
        //     const phoneReg = /^1[3-9]\d{9}$/
        //     if (!phoneReg.test(phone)) {
        //         return {
        //             code: 400,
        //             message: '手机号格式不正确'
        //         }
        //     }
        // }

        // 构建查询条件
        const whereCondition = email 
            ? 'email = ?' 
            : 'phone = ?'
        const searchValue = email || phone

        // 查找用户
        const [users] = await pool.query(
            `SELECT * FROM user WHERE ${whereCondition} LIMIT 1`,
            [searchValue]
        )

        if (!Array.isArray(users) || users.length === 0) {
            return {
                code: 400,
                message: '用户不存在'
            }
        }

        const user = users[0] as any

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return {
                code: 400,
                message: '密码错误'
            }
        }

        // 生成登录token
        const token = nanoid(32)
        const loginTime = Date.now()
        const endTime = loginTime + 7 * 24 * 60 * 60 * 1000 // token有效期7天

        // 获取数据库连接（用于事务）
        const connection = await pool.getConnection()

        try {
            // 开启事务
            await connection.beginTransaction()

            // 更新用户最后登录时间和token（如果需要持久化token的话）
            await connection.query(
                `UPDATE user SET lastLogin = ?, token = ? WHERE uid = ?`,
                [loginTime, token, user.uid]
            )

            // 更新sessions表中uid对应的token
            // 先检查是否存在该用户的session记录
            const [existingSessions] = await connection.query(
                `SELECT uid FROM sessions WHERE uid = ? LIMIT 1`,
                [user.uid]
            )
            
            if (Array.isArray(existingSessions) && existingSessions.length > 0) {
                // 存在记录，执行更新
                await connection.query(
                    `UPDATE sessions 
                     SET token = ?, loginTime = ?, endTime = ?
                     WHERE uid = ?`,
                    [token, loginTime, endTime, user.uid]
                )
            } else {
                // 不存在记录，执行插入
                await connection.query(
                    `INSERT INTO sessions (uid, token, loginTime, endTime) 
                     VALUES (?, ?, ?, ?)`,
                    [user.uid, token, loginTime, endTime]
                )
            }

            // 提交事务
            await connection.commit()

            // 构建返回数据
            const userData = {
                uid: user.uid,
                nickname: user.nickName,
                face: '', // 如果有头像字段，从数据库获取
                email: user.email || '',
                phone: user.phone || '',
                token,
                userRole: user.userRole,
                loginTime
            }

            return {
                code: 200,
                message: '登录成功',
                data: userData
            }
        }
        catch (error) {
            // 回滚事务
            await connection.rollback()
            throw error
        }
        finally {
            // 释放连接
            connection.release()
        }
    }
    catch (error: any) {
        console.error('用户登录失败:', error)
        return {
            code: 500,
            message: '登录失败',
        }
    }
})