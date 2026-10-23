<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { Selection } from '~/types/creator'

const props = defineProps<{
    selections: Selection[]
    class?: string
}>()

const model = defineModel<string>()
</script>

<template>
    <div :class="cn('flex items-center gap-4', props.class)">
        <div
            v-for="selection in props.selections"
            :key="selection.value"
            class="text-center cursor-pointer py-1 border-b-2 border-transparent transition-all ease-in-out duration-150"
            :class="selection.value === model ? 'text-gray-800 !border-gray-800' : 'text-gray-400'"
            @click="model = selection.value"
        >
            {{ selection.label }}
        </div>
    </div>
</template>
