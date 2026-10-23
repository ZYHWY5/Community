/**
 * 图片上传 API
 * POST /api/upload/file
 * 仅支持图片格式：JPG, PNG, GIF, WebP, SVG
 */
import fs from 'node:fs'
import path from 'node:path'
import { nanoid } from 'nanoid'
import pool from '~/server/db/mysql'

export default defineEventHandler(async (event) => {
    try {
        // 解析 multipart/form-data
        const formData = await readMultipartFormData(event)

        if (!formData || formData.length === 0) {
            return {
                code: 400,
                message: '没有上传文件'
            }
        }

        // 获取上传的文件
        const fileData = formData.find(item => item.name === 'file')
        if (!fileData || !fileData.data) {
            return {
                code: 400,
                message: '文件数据无效'
            }
        }

        // 获取文件信息
        const originalName = fileData.filename || 'unknown'
        const mimetype = fileData.type || 'application/octet-stream'
        const fileSize = fileData.data.length

        // 验证文件大小（20MB限制）
        const maxSize = 20 * 1024 * 1024
        if (fileSize > maxSize) {
            return {
                code: 400,
                message: '文件大小超过限制（最大 20MB）'
            }
        }

        // 验证文件类型（仅支持图片）
        const allowedImageTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml'
        ]
        
        if (!allowedImageTypes.includes(mimetype)) {
            return {
                code: 400,
                message: '仅支持图片格式 (JPG, PNG, GIF, WebP, SVG)'
            }
        }

        // 生成唯一文件名
        const ext = path.extname(originalName).toLowerCase()
        const uniqueId = nanoid(16)
        const timestamp = Date.now()
        const fileName = `${timestamp}_${uniqueId}${ext}`

        // 确保上传目录存在
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        // 保存文件到磁盘
        const filePath = path.join(uploadDir, fileName)
        fs.writeFileSync(filePath, fileData.data)

        // 生成访问URL
        const fileUrl = `/uploads/${fileName}`

        // 文件类型（仅图片）
        const fileType = 'image'

        // 获取用户ID（从 cookies）
        const userId = getCookie(event, 'app_uid') || null

        // 保存文件记录到数据库
        const fileId = nanoid(20)
        await pool.query(
            `INSERT INTO file_uploads 
            (file_id, original_name, file_name, file_path, file_url, file_type, mime_type, file_size, uid) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fileId,
                originalName,
                fileName,
                `uploads/${fileName}`,
                fileUrl,
                fileType,
                mimetype,
                fileSize,
                userId,
            ]
        )

        // 返回成功
        return {
            code: 200,
            message: '上传成功',
            data: {
                originalName,
                fileUrl,
                fileSize,
            }
        }
    }
    catch (error: any) {
        console.error('文件上传失败:', error)
        return {
            code: 500,
            message: '文件上传失败',
            error: error.message
        }
    }
})
