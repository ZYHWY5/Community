/**
 * 用户注册 API
 * POST /api/user/register
 */
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'
import type { RegisterRequestParam } from '~/types/login'

export default defineEventHandler(async (event) => {
    try {
        // 获取请求体
        const body = await readBody<RegisterRequestParam>(event)
        const { email, phone, password, fileData } = body

        // 参数验证
        // if (!nickName || nickName.trim().length === 0) {
        //     return {
        //         code: 400,
        //         message: '昵称不能为空'
        //     }
        // }

        if (!email) {
            return {
                code: 400,
                message: '邮箱不能为空'
            }
        }

        if (!password || password.length < 6) {
            return {
                code: 400,
                message: '密码长度至少为 6 位'
            }
        }

        // 邮箱格式验证（与前端保持一致）
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

        // 检查邮箱是否已存在
        if (email) {
            const [existingEmail] = await pool.query(
                'SELECT uid FROM user WHERE email = ? LIMIT 1',
                [email]
            )
            if (Array.isArray(existingEmail) && existingEmail.length > 0) {
                return {
                    code: 400,
                    message: '该邮箱已被注册'
                }
            }
        }

        // 检查手机号是否已存在
        // if (phone) {
        //     const [existingPhone] = await pool.query(
        //         'SELECT uid FROM user WHERE phone = ? LIMIT 1',
        //         [phone]
        //     )
        //     if (Array.isArray(existingPhone) && existingPhone.length > 0) {
        //         return {
        //             code: 400,
        //             message: '该手机号已被注册'
        //         }
        //     }
        // }

        // 生成 uid
        const uid = nanoid(20)

        /** 生成默认昵称 */
        const nickName = `User_${uid.slice(0, 6)}`

        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10)

        /** 用户权限默认为-1 */
        const userRole = -1

        // 获取数据库连接（用于事务）
        const connection = await pool.getConnection()

        try {
            // 开启事务
            await connection.beginTransaction()

            // 插入 user 表
            await connection.query(
                `INSERT INTO user (uid, nickName, email, phone, password, userRole, face) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [uid, nickName, email, phone || null, hashedPassword, userRole, '']
            )

            // 插入 review 表（默认未审核）
            await connection.query(
                `INSERT INTO review (uid, nickName, email, phone, userRole, reviewStatus, fileData) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [uid, nickName, email, phone || null, userRole, 0, JSON.stringify(fileData || [])]
            )

            // 提交事务
            await connection.commit()

            // 返回成功
            return {
                code: 200,
                message: '注册成功',
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
        console.error('用户注册失败:', error)
        return {
            code: 500,
            message: '注册失败',
            error: error.message
        }
    }
})
