<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: string, size?: string, text?: string, color?: string, trackColor?: string, textClass?: string }>()
const slots = useSlots()
const loaderSize = computed(() => props.size || '1em')
const trackColor = computed(() => props.trackColor || 'var(--color-gray-200)')
const color = computed(() => props.color || 'var(--color-gray-300)')
const hasText = computed(() => !!props.text || !!slots.default)
</script>

<template>
    <div
        class="loader-container"
        :class="cn('flex flex-col items-center gap-[6px]', props.class)"
    >
        <div
            class="loader"
            :style="{ width: loaderSize, height: loaderSize }"
        >
            <svg
                class="loader-svg"
                width="100%"
                height="100%"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class="loader-track opacity-30"
                    cx="8"
                    cy="8.5"
                    r="7.5"
                    :stroke="trackColor"
                    stroke-width="2"
                    fill="none"
                />
                <circle
                    class="loader-indicator"
                    cx="8"
                    cy="8.5"
                    r="7.5"
                    :stroke="color"
                    stroke-width="2"
                    fill="none"
                />
            </svg>
        </div>
        <div
            v-if="hasText"
            :class="cn('loader-text text-gray-300 text-base truncate text-center', props.textClass)"
        >
            <slot>
                {{ props.text }}
            </slot>
        </div>
    </div>
</template>

<style scoped>
.loader-container {
  --loader-circumference: 47.12389; /* 计算圆周长: 2 * π * 7.5 */
}

.loader-svg {
  transform-origin: center;
  will-change: transform;
  animation: rotate-svg 2s linear infinite;
}

.loader-indicator {
  stroke-dasharray: var(--loader-circumference);
  stroke-dashoffset: var(--loader-circumference); /* 初始时完全隐藏 */
  stroke-linecap: round;
  will-change: stroke-dashoffset;
  animation: dash 1.5s cubic-bezier(0.66, 0, 0.34, 1) infinite;
  animation-fill-mode: both;
}

@keyframes rotate-svg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: var(--loader-circumference);
  }
  50% {
    stroke-dashoffset: 0; /* 完全显示整个圆 */
  }
  100% {
    stroke-dashoffset: var(--loader-circumference);
  }
}
</style>
