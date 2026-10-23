/**
 * CMS 更新用户信息 API
 * 需验证 token，且当前用户角色必须为管理员 (userRole === 2)
 * POST /api/cms/user/update
 * 必传目标用户 uid；userRole、reviewStatus 至少传一项
 * 同步更新 review 表；userRole 变更时同步更新 user 表
 */
import pool from '~/server/db/mysql'
import { validateToken } from '~/server/utils/auth'
import type { UpdateUserDetailRequestParam } from '~/types/cms'
import { PreviewStatusEnum, UserRoleEnum } from '~/types/cms'

const VALID_USER_ROLES = new Set<number>([
    UserRoleEnum.TOURIST,
    UserRoleEnum.USER,
    UserRoleEnum.ADMIN,
])

const VALID_REVIEW_STATUS = new Set<number>([
    PreviewStatusEnum.PENDING,
    PreviewStatusEnum.APPROVED,
    PreviewStatusEnum.REJECTED,
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

        const body = await readBody<UpdateUserDetailRequestParam>(event)
        const targetUid = body?.uid?.trim()
        if (!targetUid) {
            return {
                code: 400,
                message: '缺少必要参数 uid',
            }
        }

        const userRoleProvided = body.userRole !== undefined && body.userRole !== null
        const reviewStatusProvided = body.reviewStatus !== undefined && body.reviewStatus !== null

        if (!userRoleProvided && !reviewStatusProvided) {
            return {
                code: 400,
                message: 'userRole 与 reviewStatus 需至少提供一项',
            }
        }

        if (userRoleProvided) {
            const role = Number(body.userRole)
            if (!VALID_USER_ROLES.has(role)) {
                return {
                    code: 400,
                    message: 'userRole 参数不合法',
                }
            }
        }

        if (reviewStatusProvided) {
            const status = Number(body.reviewStatus)
            if (!VALID_REVIEW_STATUS.has(status)) {
                return {
                    code: 400,
                    message: 'reviewStatus 参数不合法',
                }
            }
        }

        const [existRows] = await pool.query(
            'SELECT uid FROM review WHERE uid = ? LIMIT 1',
            [targetUid],
        )
        if (!(existRows as any[]).length) {
            return {
                code: 404,
                message: '用户不存在',
            }
        }

        const userRole = userRoleProvided ? Number(body.userRole) : undefined
        const reviewStatus = reviewStatusProvided ? Number(body.reviewStatus) : undefined

        const connection = await pool.getConnection()
        try {
            await connection.beginTransaction()

            const reviewFields: string[] = []
            const reviewValues: unknown[] = []

            if (userRoleProvided) {
                reviewFields.push('userRole = ?')
                reviewValues.push(userRole)
            }
            if (reviewStatusProvided) {
                reviewFields.push('reviewStatus = ?')
                reviewValues.push(reviewStatus)
            }

            reviewValues.push(targetUid)
            await connection.query(
                `UPDATE review SET ${reviewFields.join(', ')} WHERE uid = ?`,
                reviewValues,
            )

            if (userRoleProvided) {
                await connection.query(
                    'UPDATE user SET userRole = ? WHERE uid = ?',
                    [userRole, targetUid],
                )
            }

            await connection.commit()

            return {
                code: 200,
                message: '更新成功',
            }
        }
        catch (err) {
            await connection.rollback()
            throw err
        }
        finally {
            connection.release()
        }
    }
    catch (error: any) {
        console.error('CMS 更新用户信息失败:', error)
        return {
            code: 500,
            message: '更新用户信息失败',
            error: error.message,
        }
    }
})
