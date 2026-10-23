<script lang="ts" setup>
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import QuickPenal from './QuickPenal.vue'
import { usePlayerUserStore } from '~/stores/player-user'
import { storeToRefs } from 'pinia'
import { cn } from '~/lib/utils'

const userStore = usePlayerUserStore()
const { userInfo } = storeToRefs(userStore)

const props = withDefaults(defineProps<{
    /** 是否展示快速面板 */
    isQuickPenal?: boolean
    /** 自定义样式 */
    class?: string
}>(), {
    isQuickPenal: true,
})

const isOpen = ref(false)
</script>

<template>
    <ClientOnly>
        <Popover
            v-if="props.isQuickPenal"
            v-model:open="isOpen"
        >
            <PopoverTrigger as-child>
                <div :class="cn('w-full h-full flex items-center justify-center bg-gray-50 rounded-full overflow-hidden', props.class)">
                    <img
                        v-if="userInfo.face"
                        :src="userInfo.face"
                        class="w-full h-full object-cover"
                    >
                    <Icon
                        v-else
                        name="cs-icon:user-bold"
                        size="24"
                        class="w-full h-full text-gray-400"
                    />
                </div>
            </PopoverTrigger>

            <PopoverContent
                class="w-[248px] rounded-2xl p-2"
            >
                <QuickPenal />
            </PopoverContent>
        </Popover>
        <div
            v-else
            :class="cn('w-full h-full flex items-center justify-center bg-gray-50 rounded-full cursor-pointer overflow-hidden', props.class)"
        >
            <img
                v-if="userInfo.face"
                :src="userInfo.face"
                class="w-full h-full object-cover"
            >
            <Icon
                v-else
                name="cs-icon:user-bold"
                class="w-full h-full text-gray-400"
            />
        </div>
    </ClientOnly>
</template>
