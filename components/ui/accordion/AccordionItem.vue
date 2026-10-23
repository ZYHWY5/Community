<script lang="ts" setup>
import { AccordionItem, useForwardPropsEmits } from 'reka-ui'
import type { AccordionItemProps } from 'reka-ui'

const props = defineProps<AccordionItemProps>()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
    <AccordionItem v-bind="forwarded">
        <slot />
    </AccordionItem>
</template>

<style>

</style>
