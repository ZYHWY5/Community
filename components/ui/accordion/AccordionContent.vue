<script lang="ts" setup>
import type { AccordionContentProps } from 'reka-ui'
import { AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionContentProps & { class?: string }>()

const forwarded = useForwardPropsEmits(props)
</script>

<template>
    <AccordionContent
        v-bind="forwarded"
        :class="cn('AccordionContent', props.class)"
    >
        <slot />
    </AccordionContent>
</template>

<style scoped lang="less">
.AccordionContent {
  overflow: hidden;
  /* 添加基础过渡效果，兼容所有浏览器 */
  transition: height 300ms ease-out, opacity 200ms ease-out;
  /* 确保容器能正确计算高度 */
  box-sizing: border-box;
}

/* 针对开启状态的动画 */
.AccordionContent[data-state="open"] {
  animation: slideDown 300ms ease-out forwards;
  /* 兼容性fallback */
  -webkit-animation: slideDown 300ms ease-out forwards;
  -moz-animation: slideDown 300ms ease-out forwards;
}

/* 针对关闭状态的动画 */
.AccordionContent[data-state="closed"] {
  animation: slideUp 300ms ease-out forwards;
  /* 兼容性fallback */
  -webkit-animation: slideUp 300ms ease-out forwards;
  -moz-animation: slideUp 300ms ease-out forwards;
}

/* 改进的slideDown动画，兼容iPhone各版本 */
@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
    /* 兼容性：使用max-height作为fallback */
    max-height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    /* 兼容性：使用一个较大的max-height值 */
    max-height: 1000px;
  }
}

@keyframes slideUp {
  from {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    max-height: 1000px;
  }
  to {
    height: 0;
    opacity: 0;
    max-height: 0;
  }
}

/* WebKit浏览器兼容性 */
@-webkit-keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
    max-height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    max-height: 1000px;
  }
}

@-webkit-keyframes slideUp {
  from {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    max-height: 1000px;
  }
  to {
    height: 0;
    opacity: 0;
    max-height: 0;
  }
}

/* Firefox兼容性 */
@-moz-keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
    max-height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    max-height: 1000px;
  }
}

@-moz-keyframes slideUp {
  from {
    height: var(--reka-accordion-content-height);
    opacity: 1;
    max-height: 1000px;
  }
  to {
    height: 0;
    opacity: 0;
    max-height: 0;
  }
}

/* 当CSS变量不被支持时的fallback */
@supports not (height: var(--reka-accordion-content-height)) {
  .AccordionContent[data-state="open"] {
    animation: slideDownFallback 300ms ease-out forwards;
    -webkit-animation: slideDownFallback 300ms ease-out forwards;
    -moz-animation: slideDownFallback 300ms ease-out forwards;
  }

  .AccordionContent[data-state="closed"] {
    animation: slideUpFallback 300ms ease-out forwards;
    -webkit-animation: slideUpFallback 300ms ease-out forwards;
    -moz-animation: slideUpFallback 300ms ease-out forwards;
  }

  @keyframes slideDownFallback {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 1000px;
      opacity: 1;
    }
  }

  @keyframes slideUpFallback {
    from {
      max-height: 1000px;
      opacity: 1;
    }
    to {
      max-height: 0;
      opacity: 0;
    }
  }

  @-webkit-keyframes slideDownFallback {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 1000px;
      opacity: 1;
    }
  }

  @-webkit-keyframes slideUpFallback {
    from {
      max-height: 1000px;
      opacity: 1;
    }
    to {
      max-height: 0;
      opacity: 0;
    }
  }
}

/* 移动端特殊优化，确保在iPhone各版本中都能正常工作 */
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .AccordionContent {
    /* 强制启用硬件加速，提升移动端性能 */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    /* 确保在retina屏幕上动画流畅 */
    will-change: height, opacity, max-height;
  }
}

/* iOS Safari特殊处理 */
@supports (-webkit-appearance: none) and (not (contain: paint)) {
  .AccordionContent {
    /* iOS Safari的特殊优化 */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
}
</style>
