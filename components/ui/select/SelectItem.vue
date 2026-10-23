<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import {
    SelectItem,
    SelectItemIndicator,

    SelectItemText,
    useForwardProps,
} from 'reka-ui'
import type { SelectItemProps } from 'reka-ui'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  SelectItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props

    return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
    <SelectItem
        data-slot="select-item"
        v-bind="forwardedProps"
        :class="
            cn(
                `focus:bg-dark-50 focus:text-primary data-[state=checked]:text-primary [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2`,
                props.class,
            )
        "
    >
        <span class="absolute right-[10px] flex size-3.5 items-center justify-center text-[inherit]">
            <SelectItemIndicator>
                <Check class="size-4 text-[inherit]" />
            </SelectItemIndicator>
        </span>

        <SelectItemText>
            <slot />
        </SelectItemText>
    </SelectItem>
</template>
