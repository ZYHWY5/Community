import { decode, encode } from 'js-base64'

/**
 * 加密工具
 */
export const base64 = {
    decode(data: string) {
        return decode(data)
    },
    encode(data: string, uriSafe: boolean) {
        return encode(data, uriSafe)
    },
    encodeURI(data: string) {
        return this.encode(data, true)
    },
}
export default base64
