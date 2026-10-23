<script lang="ts" setup>
import { cn } from '~/lib/utils'
import Button from '~/components/ui/button/Button.vue'

const props = defineProps<{
    item: {
        url: string
        name: string
    }
    class?: string
}>()

const { t: $t } = useI18n()
</script>

<template>
    <div :class="cn('py-3 border-b border-gray-100', props.class)">
        <div class="flex items-center gap-2">
            <!-- img -->
            <img
                :src="props.item.url"
                class="w-[50px] h-[50px] rounded-xl object-fill"
            >
            <!-- name -->
            <span class="block flex-1 text-[14px] font-semibold truncate">
                {{ props.item.name }}
            </span>
            <!-- Button -->
            <Button
                class="w-16 h-[30px] text-xs"
            >
                {{ $t('playerCommunity.communityItem.view') }}
            </Button>
        </div>
    </div>
</template>
