// 将秒时间戳转换为毫秒时间戳
export function parseTimestamp(time: string | number) {
    const timestamp = Number(time)
    const normalizedTimestamp = timestamp < 1e12 ? timestamp * 1000 : timestamp
    return normalizedTimestamp
}
