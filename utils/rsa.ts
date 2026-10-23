import JSEncrypt from 'jsencrypt'

const mPublicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALuCRM5wqGt5Ehhq/pdGHVFZ5kemv5NS
SaOf6wc0GBJZ4ZBRGsg0SnYsdbb3p3/a9L5IU66b72tWDb89jZur4jUCAwEAAQ==
-----END PUBLIC KEY-----`

export default {
    encryptRsaPublic(string: string, publicKey?: string) {
        const crypt = new JSEncrypt()
        crypt.setPublicKey(publicKey || mPublicKey)
        const enc = crypt.encrypt(string)
        return enc
    },
}
