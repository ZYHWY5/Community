<script lang="ts" setup>
import { AccordionHeader, useForwardPropsEmits } from 'reka-ui'
import type { AccordionHeaderProps } from 'reka-ui'

const props = defineProps<AccordionHeaderProps>()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
    <AccordionHeader v-bind="forwarded">
        <slot />
    </AccordionHeader>
</template>

<style>

</style>
