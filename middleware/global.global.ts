import { StatusEnum } from '~/types/creator'

export default defineNuxtRouteMiddleware((to, from) => {
    try {
        if (import.meta.client) {
            useLang('playerCommunity', { immediate: true })
            const { $i18n } = useNuxtApp()
            const $t = (key: string) => $i18n.t(key) as string
            const isCreatorPath = (path: string) => {
                const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : path
                return normalizedPath === '/creator' || normalizedPath === '/zh/creator'
            }
            const { isLogin } = storeToRefs(usePlayerUserStore())
            const creatorStore = useCreatorStore()
            const { isHaveData, currentStatus } = storeToRefs(creatorStore)
            const { loadDraft, saveDraft, clearFormData } = creatorStore
            /** 离开Creator页面是否允许放行(避免按钮触发的二次跳转又被拦截) */
            const creatorLeaveBypassOnce = useState<boolean>('creator-leave-bypass-once', () => false)

            /** 未发布草稿提示 */
            if (isLogin.value && isCreatorPath(to.path) && currentStatus.value === StatusEnum.POST) {
                const draft = localStorage.getItem('creator_post_draft')
                if (!draft) return
                useConfirmDialog().open({
                    title: $t('playerCommunity.globalMiddleware.unpublishedDraft.title'),
                    message: $t('playerCommunity.globalMiddleware.unpublishedDraft.message'),
                    okText: $t('playerCommunity.globalMiddleware.unpublishedDraft.okText'),
                    cancelText: $t('playerCommunity.globalMiddleware.unpublishedDraft.cancelText'),
                    onOk: () => {
                        loadDraft()
                    },
                })
            }
            /** 离开Creator页面提示保存草稿 */
            if (creatorLeaveBypassOnce.value) {
                creatorLeaveBypassOnce.value = false
            }
            else if (isLogin.value && isCreatorPath(from.path) && isHaveData.value && currentStatus.value === StatusEnum.POST) {
                const draft = localStorage.getItem('creator_post_draft')
                if (draft) return

                const pendingRoute = {
                    path: to.path,
                    query: to.query,
                    hash: to.hash,
                }

                useConfirmDialog().open({
                    title: $t('playerCommunity.globalMiddleware.saveDraft.title'),
                    message: $t('playerCommunity.globalMiddleware.saveDraft.message'),
                    okText: $t('playerCommunity.globalMiddleware.saveDraft.okText'),
                    cancelText: $t('playerCommunity.globalMiddleware.saveDraft.cancelText'),
                    onOk: () => {
                        saveDraft()
                        creatorLeaveBypassOnce.value = true
                        navigateTo(pendingRoute)
                    },
                    onCancel: () => {
                        creatorLeaveBypassOnce.value = true
                        clearFormData()
                        navigateTo(pendingRoute)
                    },
                })
                return abortNavigation()
            }
        }

    // 这里可以添加其他全局逻辑，如权限验证、分析统计等
    }
    catch (error) {
        console.error('Global middleware error', error)
    }
})
