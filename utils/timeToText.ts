import dayjs from 'dayjs'

/**
 * 将时间戳转为相对时间文案。
 * 按整数位数判断单位：≤10 位视为秒；≥13 位视为毫秒；11～12 位时再用 &lt; 1e12 区分秒/毫秒。
 */
export const timeToText = (time: string | number) => {
    const n = Number(time)
    if (!Number.isFinite(n) || n <= 0) {
        return ''
    }
    const absInt = Math.trunc(Math.abs(n))
    const digitLen = absInt === 0 ? 1 : String(absInt).length

    let ms: number
    if (digitLen <= 10) {
        ms = n * 1000
    }
    else if (digitLen >= 13) {
        ms = n
    }
    else {
        ms = n < 1e12 ? n * 1000 : n
    }

    const now = dayjs()
    const createTime = dayjs(ms)
    const diff = now.diff(createTime, 'second')
    if (diff < 60) {
        return `${diff} seconds ago`
    }
    else if (diff < 3600) {
        return `${Math.floor(diff / 60)} minutes ago`
    }
    else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} hours ago`
    }
    else if (diff < 604800) {
        return `${Math.floor(diff / 86400)} days ago`
    }
    else {
        return createTime.format('YYYY-MM-DD')
    }
}
