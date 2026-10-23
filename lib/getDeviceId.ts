import { nanoid } from 'nanoid'

export function getDeviceId() {
    let deviceId = localStorage.getItem('fingerprintId') || ''
    // fingerprintjs 无法加载回退机制
    if (!deviceId) {
        deviceId = getFallbackId()
    }
    return deviceId
}

function getFallbackId() {
    let fallbackId = sessionStorage.getItem('fallback_device_id')
    if (!fallbackId) {
        fallbackId = nanoid()
        sessionStorage.setItem('fallback_device_id', fallbackId)
    }
    return fallbackId
}
