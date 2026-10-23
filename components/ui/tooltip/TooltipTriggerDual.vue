<script setup lang="ts">
import { TooltipTrigger, injectTooltipRootContext } from 'reka-ui'
import type { TooltipTriggerProps } from 'reka-ui'

import { onLongPress } from '@vueuse/core'

const rootContext = injectTooltipRootContext()
const triggerRef = ref<InstanceType<typeof TooltipTrigger>>()
const props = defineProps<TooltipTriggerProps>()

const tooltipListeners = computed(() => {
    if (rootContext.disabled.value)
        return {}

    return {
        pointermove: rootContext.onTriggerEnter,
    }
})

onLongPress(
    triggerRef,
    () => {
        if (rootContext.disabled.value)
            return

        rootContext.onTriggerEnter()
    },
    {
        delay: 500,
        onMouseUp: () => {
            rootContext.onTriggerLeave()
        },
    },
)
</script>

<template>
    <TooltipTrigger
        ref="triggerRef"
        data-slot="tooltip-trigger"
        v-bind="props"
        v-on="tooltipListeners"
    >
        <slot />
    </TooltipTrigger>
</template>
