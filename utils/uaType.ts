export function getUaType() {
    if (!import.meta.client) {
        return {
            matchUA: null,
            IsAndroidApp: false,
            IsAndroid: false,
            IsIOS: false,
            IsIPad: false,
            IsNewIosApp: false,
            IsKEWLApp: false,
            IsPC: true,
        }
    }
    const iosUAKeyword = 'live.me-iOS' // 这个待定
    const ROOT: Window & {
        LMUserAgent?: any
        MSStream?: any
        webkit?: {
            messageHandlers?: {
                webViewApp?: {
                    postMessage?: any
                }
            }
        }
        android?: {
            openBoZhuPage?: any
        }
    } = window

    const UA = ROOT.navigator.userAgent
    const reg = new RegExp(`${iosUAKeyword}/(.+)`, 'i')
    const matchUA
        = UA.match(reg) || (ROOT.LMUserAgent && ROOT.LMUserAgent.match(reg))

    const IsAndroid = /Android|HTC/i.test(UA)
    const IsIPad
        = !IsAndroid
          && (/iPad/i.test(UA)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
          && !ROOT.MSStream
    const IsIPhone = !IsAndroid && /iPod|iPhone/i.test(UA)
    const IsIOS = IsIPad || IsIPhone
    const IsPC
        = !IsAndroid && !IsIOS && !UA.toLocaleLowerCase().includes('xiaomi')

    const IsNewIosApp
        = typeof ROOT.webkit === 'object'
          && !!ROOT.webkit.messageHandlers
          && !!ROOT.webkit.messageHandlers.webViewApp
          && !!ROOT.webkit.messageHandlers.webViewApp.postMessage
          && typeof ROOT.webkit.messageHandlers.webViewApp.postMessage === 'function'
    // IosPostMessage = IsNewIosApp ? ROOT.webkit.messageHandlers.webViewApp.postMessage : null,
    const IsKEWLApp
        = (IsAndroid
          && typeof ROOT.android === 'object'
          && Object.prototype.hasOwnProperty.call(ROOT.android, 'openBoZhuPage'))
        || !!IsNewIosApp
        || reg.test(UA)
    // || /live\.me-ios/i.test(UA);
    const IsAndroidApp = IsKEWLApp && !IsIOS
    return {
        matchUA,
        IsAndroidApp,
        IsAndroid,
        IsIOS,
        IsIPad,
        IsNewIosApp,
        IsKEWLApp,
        IsPC,
    }
}
