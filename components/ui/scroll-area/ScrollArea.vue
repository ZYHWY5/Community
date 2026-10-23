<script setup lang="ts">
import {
    ScrollAreaCorner,
    ScrollAreaRoot,

    ScrollAreaViewport,
} from 'reka-ui'
import type { ScrollAreaRootProps } from 'reka-ui'
import { computed, useAttrs } from 'vue'
import type { HTMLAttributes } from 'vue'
import ScrollBar from './ScrollBar.vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
    defineProps<
      ScrollAreaRootProps & {
          class?: HTMLAttributes['class']
          bodyClass?: HTMLAttributes['class']
          scrollbarAlwaysVisible?: boolean
      }
    >(),
    {
        scrollbarAlwaysVisible: false,
    },
)
const emits = defineEmits(['scroll'])
const attrs = useAttrs()

const delegatedProps = computed(() => {
    const { class: _, bodyClass, scrollbarAlwaysVisible, ...delegated } = props
    return delegated
})

const type = computed(() => {
    if (props.type) {
        return props.type
    }
    return props.scrollbarAlwaysVisible ? 'always' : 'scroll'
})

function handleScroll(event: Event) {
    emits('scroll', event)
}
</script>

<template>
    <ScrollAreaRoot
        data-slot="scroll-area"
        :class="cn('relative', props.class)"
        v-bind="delegatedProps"
        :type="type"
        v-on="attrs"
    >
        <ScrollAreaViewport
            data-slot="scroll-area-viewport"
            class="scroll-area-viewport focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-none focus-visible:outline-none"
            @scroll="handleScroll"
        >
            <slot />
        </ScrollAreaViewport>
        <ScrollBar :class="bodyClass" />
        <ScrollAreaCorner />
    </ScrollAreaRoot>
</template>
