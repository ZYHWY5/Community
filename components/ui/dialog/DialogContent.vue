<script setup lang="ts">
import { X } from 'lucide-vue-next'
import {
    DialogClose,
    DialogContent,

    DialogPortal,
    useForwardPropsEmits,
} from 'reka-ui'
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import DialogOverlay from './DialogOverlay.vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
    defineProps<
      DialogContentProps & {
          class?: HTMLAttributes['class']
          overlayClass?: HTMLAttributes['class']
          hideClose?: boolean
          closeClass?: HTMLAttributes['class']
          closeIconClass?: HTMLAttributes['class']
          closeXClass?: HTMLAttributes['class']
          autoFocus?: boolean
      }
    >(),
    {
        hideClose: false,
        autoFocus: true,
    },
)
const emits = defineEmits<DialogContentEmits & {
    opened: []
    closed: []
}>()

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props

    return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const handleCloseAutoFocus = (event: Event) => {
    if (!props.autoFocus) {
        event.preventDefault();
        (event.target as HTMLElement)?.blur?.()
    }
}

// Presence 组件的 CustomEvent 事件处理器
const handleAfterEnter = () => {
    emits('opened')
}

const handleAfterLeave = () => {
    emits('closed')
}
</script>

<template>
    <DialogPortal>
        <DialogOverlay :class="props.overlayClass" />
        <DialogContent
            data-slot="dialog-content"
            v-bind="forwarded"
            :class="
                cn(
                    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200',
                    props.class,
                )
            "
            @after-enter="handleAfterEnter"
            @after-leave="handleAfterLeave"
            @close-auto-focus="handleCloseAutoFocus"
        >
            <slot />

            <DialogClose
                v-if="!props.hideClose"
                class="z-10001 ring-offset-background data-[state=open]:bg-accent data-[state=open]:text-muted-foreground transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                :class="cn('absolute top-4 right-4 rounded-xs opacity-70', props.closeClass)"
            >
                <slot name="close">
                    <div :class="cn('border-border rounded-full p-2 bg-white/40 flex items-center justify-center', props.closeIconClass)">
                        <X :class="closeXClass" />
                        <span class="sr-only">Close</span>
                    </div>
                </slot>
            </DialogClose>
        </DialogContent>
    </DialogPortal>
</template>
