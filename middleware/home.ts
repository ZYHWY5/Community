/**
 * Home页面中间件
 * 检测登录态，如果已登录则307重定向到主页
 */
export default defineNuxtRouteMiddleware(to => {
    // 使用统一的认证Cookie工具
    const { isLoggedIn } = useAuthCookies()

    // 如果已登录且访问home页面，则重定向到主页
    if (isLoggedIn.value && to.path === '/') {
        return navigateTo({
            path: '/app',
            query: to.query,
        }, {
            redirectCode: 307,
            external: false,
        })
    }
})
