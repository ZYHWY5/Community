import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'community',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+08:00', // 中国标准时间
})

// 测试连接并初始化数据库
async function initDatabase() {
    try {
        const connection = await pool.getConnection()
        console.log('✅ MySQL 数据库连接成功')
        
        connection.release()
    } catch (error: any) {
        console.error('❌ MySQL 数据库连接失败:', error.message)
        console.error('请检查：')
        console.error('  1. MySQL 服务是否已启动')
        console.error('  2. 数据库是否已创建')
    }
}

// 启动时初始化
initDatabase()

export default pool
