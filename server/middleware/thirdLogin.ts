import useConst from '~/composables/useConst'

export default defineEventHandler(async event => {
    const urlObj = getRequestURL(event)
    const { protocol } = urlObj
    if (urlObj.pathname === '/thirdlogin/index') {
        const { loginConfig } = useConst()
        const redirectHost = `${protocol}//${loginConfig.thirdHost}`
        const url = `${redirectHost}/third/login${urlObj.search}`
        await sendRedirect(event, `${url}`, 302)
    }
})
