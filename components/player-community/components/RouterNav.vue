<script lang="ts" setup>
import { cn } from '~/lib/utils'

const props = defineProps<{
    settingList?: Array<{ icon: string, label: string, to: string }>
    class?: string
    postPosition?: boolean
}>()

const route = useRoute()
const localePath = useLocalePath()
const { t: $t } = useI18n()

const isActive = (to: string) => {
    return route.path.includes(to)
}

const defaultSettings = ref([
    { icon: 'cs-icon:text-to-image', label: $t('playerCommunity.routerNav.defaultSettings.community'), to: 'test' },
    { icon: 'cs-icon:home-regular', label: $t('playerCommunity.routerNav.defaultSettings.creator'), to: 'creator' },
    { icon: 'cs-icon:setting-regular', label: $t('playerCommunity.routerNav.defaultSettings.manage'), to: 'cms' },
])

const handleJump = (to: string) => {
    navigateTo(localePath(`/${to}`))
}
</script>

<template>
    <div>
        <!-- 使用插槽支持整体自定义 -->
        <slot>
            <div :class="cn('hidden sm:block w-14 lg:w-48', props.class)">
                <!-- 发布内容按钮(可通过props控制位置上下,默认在下方) -->
                <div v-if="props.postPosition">
                    <Button
                        class="w-full h-[46px] mb-4"
                        @click="handleJump('creator')"
                    >
                        <Icon
                            :name="'cs-icon:add-regular'"
                            size="20"
                        />
                        {{ $t('playerCommunity.routerNav.publish') }}
                    </Button>
                </div>
                <!-- 最外层容器（背景颜色、圆角等） -->
                <div
                    class="w-full -block bg-white rounded-xl"
                >
                    <!-- 内容容器（内边距、子元素间距等） -->
                    <div
                        class="p-3 space-y-2"
                    >
                        <div
                            v-for="item in props.settingList || defaultSettings"
                            :key="item.to"
                            class="flex items-center justify-center lg:justify-start gap-3 text-[14px] font-medium cursor-pointer p-2 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            :class="isActive(item.to) ? 'bg-gray-100' : 'text-gray-600'"
                            @click="handleJump(item.to)"
                        >
                            <Icon
                                :name="item.icon"
                                size="14"
                                class="lg:ml-1"
                            />
                            <span class="hidden lg:block">
                                {{ item.label }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 发布内容按钮(可通过props控制位置上下,默认在下方) -->
                <div v-if="!props.postPosition">
                    <Button
                        class="w-full h-[46px] mt-4"
                        @click="handleJump('creator')"
                    >
                        <Icon
                            :name="'cs-icon:add-regular'"
                            size="20"
                        />
                        <span class="hidden lg:block">
                            {{ $t('playerCommunity.routerNav.publish') }}
                        </span>
                    </Button>
                </div>
            </div>
        </slot>
    </div>
</template>
