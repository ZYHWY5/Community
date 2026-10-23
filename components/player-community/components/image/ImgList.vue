<script lang="ts" setup>
import { useImagePreview } from './useImagePreview'

const { open: openImagePreview } = useImagePreview()

const props = defineProps<{
    images: string[]
}>()

/** 获取图片长宽比 */
function getImageOrientation(url: string): Promise<'landscape' | 'portrait' | 'square'> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            if (img.naturalWidth >= img.naturalHeight) {
                resolve('landscape') // 横屏
            }
            else {
                resolve('portrait') // 竖屏
            }
        }
        img.onerror = reject
        img.src = url
    })
}

/** 判断图片布局 */
const witchLayout = ref<'landscape' | 'portrait'>('portrait')

/** 计算图片长度文本 */
const lengthText = computed(() => {
    if (props.images.length <= 10) return `+${props.images.length}`
    return '+10'
})

/** 打开图片预览 */
const handleImagePreview = (index: number) => {
    openImagePreview({
        /* 只预览外部三张图片 */
        images: props.images.slice(0, 3),
        index,
    })
}

onMounted(async () => {
    if (props.images.length <= 2) return
    const orientations = await Promise.all(
        props.images.slice(0, 3).map(url => getImageOrientation(url)),
    )
    const landscapeCount = orientations.filter(o => o === 'landscape').length
    witchLayout.value = landscapeCount > orientations.length / 2 ? 'landscape' : 'portrait'
})
</script>

<template>
    <div>
        <!-- 单张图片 -->
        <div
            v-if="images.length === 1"
            class="w-full h-[190px] overflow-hidden"
        >
            <img
                :src="images[0]"
                class="w-auto max-w-full h-full object-fill rounded-xl cursor-zoom-in"
            >
        </div>
        <!-- 两张图片 -->
        <div
            v-else-if="images.length === 2"
            class="w-full h-[190px] flex items-center gap-1 overflow-hidden"
        >
            <img
                v-for="image in images"
                :key="image"
                :src="image"
                class="w-auto max-w-1/2 h-full object-fill rounded-xl cursor-zoom-in"
            >
        </div>
        <!-- 三张及以上图片 -->
        <div
            v-else
            class="w-full overflow-hidden"
            :class="witchLayout === 'landscape' ? 'h-[137px] md:h-[250px]' : 'h-[113px] md:h-[190px]'"
        >
            <!-- 横屏布局 -->
            <div
                v-if="witchLayout === 'landscape'"
                class="w-full h-full flex items-center gap-1 overflow-hidden"
            >
                <img
                    :src="images[0]"
                    class="w-[65%] h-full object-fill rounded-xl cursor-zoom-in"
                    @click.stop="handleImagePreview(0)"
                >
                <div class="w-auto max-w-[35%] h-full flex flex-col items-center gap-1 overflow-hidden relative">
                    <img
                        v-for="(image, index) in images.slice(1, 3)"
                        :key="image + index"
                        :src="image"
                        class="w-auto max-w-full h-[calc(50%-2px)] object-fill rounded-xl cursor-zoom-in"
                        @click.stop="handleImagePreview(index + 1)"
                    >
                    <div
                        v-if="images.length > 3"
                        class="absolute top-0 left-0 text-[10px] text-gray-100 p-1"
                    >
                        {{ lengthText }}
                    </div>
                </div>
            </div>
            <!-- 竖屏布局 -->
            <div
                v-else
                class="w-full h-full flex items-center gap-1 overflow-hidden relative"
            >
                <img
                    v-for="image in images.slice(0, 3)"
                    :key="image"
                    :src="image"
                    class="w-full max-w-[32%] h-full object-fill rounded-xl cursor-zoom-in"
                >
                <div
                    v-if="images.length > 3"
                    class="absolute top-0 left-0 text-[10px] text-gray-100 p-1"
                >
                    {{ lengthText }}
                </div>
            </div>
        </div>
    </div>
</template>
