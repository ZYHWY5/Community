<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { buttonVariants } from '.'
import type { ButtonVariants } from '.'
import { cn } from '@/lib/utils'
import InlineLoader from '~/components/common/InlineLoader.vue'

interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    class?: HTMLAttributes['class']
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    loading: false,
})
</script>

<template>
    <Primitive
        data-slot="button"
        :as="as"
        :as-child="asChild"
        :class="cn(buttonVariants({ variant, size }), props.class)"
    >
        <slot />
        <div
            v-if="loading"
            class="ui-button-loading"
        >
            <InlineLoader
                size="1em"
            />
        </div>
    </Primitive>
</template>
