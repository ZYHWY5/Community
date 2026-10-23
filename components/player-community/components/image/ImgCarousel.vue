<script lang="ts" setup>
import { cn } from '~/lib/utils'
import { useImagePreview } from './useImagePreview'

const { open: openImagePreview } = useImagePreview()

const props = defineProps<{
    images: string[]
    /** 自定义类名 */
    class?: string
}>()

/** 当前图片索引 */
const currentIndex = ref(0)

/** 处理上一张 */
const handlePrev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    }
}

/** 处理下一张 */
const handleNext = () => {
    if (currentIndex.value < props.images.length - 1) {
        currentIndex.value++
    }
}

/** 处理指示器点击 */
const handleIndicatorClick = (index: number) => {
    if (index === currentIndex.value) return
    currentIndex.value = index
}

/** 处理图片预览 */
const handleImagePreview = (index: number) => {
    openImagePreview({
        images: props.images,
        index,
    })
}
</script>

<template>
    <div :class="cn('w-full overflow-hidden relative group', props.class)">
        <div
            class="flex items-center transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
            <img
                v-for="(image, index) in props.images"
                :key="index"
                :src="image"
                class="w-full h-full object-cover cursor-zoom-in"
                @click="handleImagePreview(index)"
            >
        </div>
        <!-- 操作按钮 and 数量显示 -->
        <div
            v-if="currentIndex > 0"
            class="w-7 h-7 absolute top-1/2 -translate-y-1/2 left-[-28px] opacity-0 flex items-center justify-center text-gray-100/70 bg-gray-600/70 rounded-lg cursor-pointer group-hover:opacity-100 group-hover:left-1 transition-all duration-300 ease-out"
            @click="handlePrev"
        >
            <Icon
                name="cs-icon:arrow-forward-ios"
                size="16"
                class="text-white rotate-180"
            />
        </div>
        <div
            v-if="currentIndex < props.images.length - 1"
            class="w-7 h-7 absolute top-1/2 -translate-y-1/2 right-[-28px] opacity-0 flex items-center justify-center text-gray-100/70 bg-gray-600/70 rounded-lg cursor-pointer group-hover:opacity-100 group-hover:right-1 transition-all duration-300 ease-out"
            @click="handleNext"
        >
            <Icon
                name="cs-icon:arrow-forward-ios"
                size="16"
                class="text-white"
            />
        </div>
        <!-- 数量显示 -->
        <div class="absolute top-2 right-2 text-xs text-gray-100/70 bg-gray-600/70 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {{ currentIndex + 1 }}/{{ props.images.length }}
        </div>
    </div>
    <!-- 指示器 -->
    <div class="flex items-center gap-2 justify-center mt-2">
        <div
            v-for="(_, index) in props.images"
            :key="index"
            class="w-5 h-[5px] rounded-xl cursor-pointer"
            :class="currentIndex === index ? 'bg-gray-600' : 'bg-gray-100'"
            @click="handleIndicatorClick(index)"
        />
    </div>
</template>
