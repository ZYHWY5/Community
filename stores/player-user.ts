import { defineStore } from 'pinia'
import { useLoginDialog } from '~/composables/useLoginDialog'
import type { UserInfo, UpdateUserProfileRequestParam } from '~/types/player-user'
import { getUserProfile as getUserProfileWithApi, updateUserProfile as updateUserProfileWithApi } from '~/api/player-user'

const toast = useToast()

const usePlayerUserStore = defineStore(
    'playerUser-store',
    () => {
        // const nuxtApp = useNuxtApp()
        /** Todo:加载login命名空间的翻译并立即注入到全局i18n实例 */
        // useLang('login', { immediate: true })
        // const $t = nuxtApp.$i18n.t

        /** 用户信息 */
        const userInfo = ref<UserInfo>({
            uid: '',
            nickName: '',
            face: '',
            email: '',
            phone: '',
            token: '',
            userRole: -1,
            level: 0,
        })

        /** 是否已登录 */
        const isLoggedIn = computed(() => {
            const tokenCookie = useCookie('token')
            return !!tokenCookie.value
        })
        const isLogin = computed(() => {
            return isLoggedIn.value || Boolean(userInfo.value.token && userInfo.value.uid)
        })

        /** 监听登录状态变化，获取用户信息 */
        watch(isLogin, async newVal => {
            if (newVal === true) {
                /** 用户已登录，通过api获取用户信息 */
                try {
                    const response = await getUserProfileWithApi()
                    updateUserInfo(response)
                }
                catch (error) {
                    console.error('获取用户信息失败:', error)
                }
            }
        }, {
            immediate: true,
        })

        /** 更新用户信息 */
        const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
            userInfo.value = { ...userInfo.value, ...newUserInfo }
        }

        /** 更新用户信息(API) */
        const updateUserProfile = async (data: UpdateUserProfileRequestParam) => {
            try {
                const response = await updateUserProfileWithApi(data)
                updateUserInfo(response)
                toast.success('更新用户信息成功')
            }
            catch {
                toast.error('更新用户信息失败')
            }
        }

        /** 打开登录弹窗 */
        const openLoginDialog = () => {
            useLoginDialog().open()
        }
        /** 关闭登录弹窗 */
        const closeLoginDialog = () => {
            useLoginDialog().close()
        }

        return {
            userInfo,
            isLogin,
            updateUserInfo,
            updateUserProfile,
            openLoginDialog,
            closeLoginDialog,
        }
    })

export { usePlayerUserStore }
