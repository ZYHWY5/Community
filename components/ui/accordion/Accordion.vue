<script lang="ts" setup>
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import { AccordionRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionRootProps & { class?: string }>()
const emits = defineEmits<AccordionRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
    <AccordionRoot
        data-slot="accordion"
        v-bind="forwarded"
        :class="cn('AccordionRoot', props.class)"
    >
        <slot />
    </AccordionRoot>
</template>
