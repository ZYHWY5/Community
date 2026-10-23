<script lang="ts" setup>
import { cn } from '~/lib/utils'
import { useCommunityStore } from '~/stores/community'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { isShowMobileNav } = storeToRefs(useCommunityStore())
const route = useRoute()
const localePath = useLocalePath()

/** 导航配置列表 */
const navList = ref([
    {
        icon: 'cs-icon:home-regular',
        label: $t('playerCommunity.mobileNav.home'),
        router: '/test',
    },
    {
        icon: 'cs-icon:add-regular',
        label: $t('playerCommunity.mobileNav.publish'),
        router: '/creator',
    },
    {
        icon: 'cs-icon:home-regular',
        label: $t('playerCommunity.mobileNav.profile'),
        router: '/profile',
    },
])

const isActive = (to: string) => {
    return route.path.includes(to)
}

const handleJump = (to: string) => {
    navigateTo(localePath(to))
}
</script>

<template>
    <nav
        v-if="isShowMobileNav"
        class="w-full h-[50px] fixed sm:hidden left-0 bottom-0 z-9 bg-gray-100"
    >
        <div class="w-full h-full flex items-center justify-around p-1">
            <div
                v-for="(item, index) in navList"
                :key="index"
                class="flex flex-col items-center justify-center cursor-pointer"
                @click="handleJump(item.router)"
            >
                <Icon
                    :name="item.icon"
                    size="18"
                    :class="cn(isActive(item.router) ? '' : 'text-gray-500')"
                />
                <span :class="cn('text-[9px] mt-1', isActive(item.router) ? '' : 'text-gray-500')">
                    {{ item.label }}
                </span>
            </div>
        </div>
    </nav>
</template>
