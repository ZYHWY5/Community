import { defineEventHandler, sendRedirect, getRequestURL } from 'h3'

export default defineEventHandler(event => {
    const { pathname, search } = getRequestURL(event)
    // 检测URL参数包含code时跳转到auth-page并携带所有参数
    // 排除auth-page路径本身，避免无限重定向
    if (search.includes('code=') && !['/auth-page', '/thirdlogin/index'].includes(pathname)) {
        const currentFullPath = pathname
        const redirectParam = encodeURIComponent(currentFullPath)
        const separator = search ? '&' : '?'
        return sendRedirect(event, `/auth-page${search}${separator}redirect=${redirectParam}`, 301)
    }

    // 处理URL末尾斜杠

    if (pathname && pathname !== '/' && pathname.endsWith('/')) {
        return sendRedirect(event, pathname.slice(0, -1) + search, 301)
    }

    // By doing nothing else, we allow Nuxt to correctly handle all other cases,
    // including rendering our new error.vue for non-existent pages.
})
