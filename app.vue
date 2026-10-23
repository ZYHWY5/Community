<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { Toaster } from '~/components/ui/sonner'
// import FullLoader from '~/components/common/FullLoader.vue'
// import { useLoadingStore } from '~/stores/loading'
// import { useChunkErrorHandler } from '~/composables/useChunkErrorHandler'
// import { usePrivateMode } from '~/composables/usePrivateMode'
// import { getPageSeoMeta, usePageSeo, useSeoRouteWhiteList } from '~/composables/usePageSeo'
import { useSeoMeta } from '#imports'
// import SetInviteCodeDialog from '~/components/business/SetInviteCodeDialog.vue'
// import { useInviteCodeDialog } from '~/composables/useInviteCodeDialog'

// 异步加载对话框组件，减少首屏加载时间
// const UserSettingsDialog = defineAsyncComponent(() =>
//     import('~/components/business/user-settings/UserSettingsDialog.vue'),
// )
// const ShareAppDialog = defineAsyncComponent(() =>
//     import('~/components/business/ShareAppDialog.vue'),
// )
// const ActivityDialog = defineAsyncComponent(() =>
//     import('~/components/business/ActivityDialog.vue'),
// )

// 为 Reka UI 提供 SSR 友好的 useId 函数
const useIdFunction = () => useId()

// useI18n(useLang('setting'))
const route = useRoute()
const i18nHead = useLocaleHead({
    seo: {
        canonicalQueries: [],
    },
})

// 使用SEO路由白名单 composable
// const { isInSeoWhiteList } = useSeoRouteWhiteList()

async function updateSeoMeta() {
    // const seoMeta = getPageSeoMeta(usePageSeo(route.name as string))
    useHead(() => ({
        htmlAttrs: {
            lang: i18nHead.value.htmlAttrs?.lang,
        },
        link: [
            ...(i18nHead.value.link || []).map(cur => {
                return {
                    ...cur,
                    href: cur.href.replace(/\?.*$/, ''),
                    key: cur.hid,
                }
            }),
        ],
        meta: [...(i18nHead.value.meta || [])].map(cur => {
            return {
                ...cur,
                key: cur.hid,
            }
        }),
    }))

    // 使用SEO白名单判断方法
    // if (isInSeoWhiteList()) {
    //     return
    // }

    // useSeoMeta(seoMeta)
}
// 监听路由路径变化，而不是路由名称
// watch(() => route.path, updateSeoMeta, { immediate: true })
// const loadingStore = useLoadingStore()
const nuxtApp = useNuxtApp()
// usePrivateMode()
// 使用简化的chunk错误处理器
// 触发一下编译
// const { checkError } = useChunkErrorHandler()

// 使用 Nuxt Hook 监听全局错误
nuxtApp.hook('app:error', (...args) => {
    const error = args[0] as Error
    console.log('🔍 App error hook 触发:', error.message, error, args)

    // 使用 checkError 检查并处理chunk错误
    // checkError(error)
})

nuxtApp.hook('vue:error', (...args) => {
    const error = args[0] as Error
    console.log('🔍 Vue error hook 触发:', error.message, error, args)

    // 使用 checkError 检查并处理chunk错误
    // checkError(error)
})
// const { isOpen: isInviteCodeOpen } = useInviteCodeDialog()
</script>

<template>
    <ConfigProvider :use-id="useIdFunction">
        <NuxtLayout>
            <NuxtPage
                v-slot="{ Component, route: pageRoute }"
                class="z-1"
            >
                <KeepAlive :max="10">
                    <component
                        :is="Component"
                        :key="pageRoute.meta.key || pageRoute.path"
                    />
                </KeepAlive>
            </NuxtPage>
            <ClientOnly>
                <Toaster />
                <!-- <FullLoader :value="loadingStore.ajaxLoader" /> -->
                <!-- <SetInviteCodeDialog v-model="isInviteCodeOpen" /> -->
                <!-- <UserSettingsDialog /> -->
                <!-- <ShareAppDialog /> -->
                <!-- <ActivityDialog /> -->
            </ClientOnly>
        </NuxtLayout>
    </ConfigProvider>
</template>
