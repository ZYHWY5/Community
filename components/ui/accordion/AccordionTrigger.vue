<script lang="ts" setup>
import { AccordionTrigger, useForwardPropsEmits } from 'reka-ui'
import type { AccordionTriggerProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionTriggerProps & { class?: string }>()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
    <AccordionTrigger
        v-bind="forwarded"
        :class="cn('AccordionTrigger flex items-center justify-between', props.class)"
    >
        <slot />
        <slot name="icon">
            <Icon
                class="AccordionChevron hidden md:block"
                name="mdi:chevron-down"
                size="32"
            />
            <Icon
                class="AccordionChevron block md:hidden"
                name="mdi:chevron-down"
                size="16"
            />
        </slot>
    </AccordionTrigger>
</template>

<style scoped lang="less">
.AccordionChevron {
  transition: transform 300ms;
}
.AccordionTrigger[data-state="open"] > .AccordionChevron {
  transform: rotate(180deg);
}
</style>
