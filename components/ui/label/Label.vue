<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps, useForwardExpose } from 'reka-ui'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
    for?: string
    class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
    as: 'label', // 默认渲染为 label 元素
})

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props

    return delegated
})
useForwardExpose()
</script>

<template>
    <Primitive
        data-slot="label"
        v-bind="delegatedProps"
        :class="
            cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                props.class,
            )
        "
        @mousedown="(event: MouseEvent) => {
            // prevent text selection when double clicking label
            if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }"
    >
        <slot />
    </Primitive>
</template>
