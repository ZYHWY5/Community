/**
 * 获取同盾ID
 * 如果同盾不存在，则返回空字符串, 同盾存在的情况下保证获取到同盾ID,但是是异步的
 * @returns Promise<string> 同盾ID
 */
export function getTongdunIdPromise() {
    return new Promise(resolve => {
        if (!import.meta.client || !window.TONGDun) return ''
        let blackBox = window.TONGDun.getBlackBox()
        if (!blackBox) {
            window.TONGDun.init(_blackBox => {
                blackBox = _blackBox
                resolve(blackBox)
            })
        }
        else {
            resolve(blackBox)
        }
    })
}

/**
 * 获取同盾ID
 * 如果同盾不存在，则返回空字符串, 不保证获取到同盾ID，但是不会阻塞页面加载
 * @returns 同盾ID
 */
export function getTongdunId() {
    if (!import.meta.client || !window.TONGDun) return ''
    const blackBox = window.TONGDun.getBlackBox()
    return blackBox || ''
}
