<script setup lang="ts">
import { Dialog, DialogContent } from '~/components/ui/dialog'

const props = defineProps<{
    images: string[]
    index?: number
}>()

const isOpen = ref(false)

const currentIndex = ref(props.index ?? 0)

// 每张图片的缩放比例
const zoomLevels = ref<number[]>([])
// 每张图片的位置偏移
const imageOffsets = ref<{ x: number, y: number }[]>([])
// 拖拽状态
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const dragImageIndex = ref(-1)

/** 打开弹窗 */
const openDialog = () => {
    isOpen.value = true
    // 只在数组为空时初始化（避免重复初始化）
    if (zoomLevels.value.length === 0 || imageOffsets.value.length === 0) {
        zoomLevels.value = props.images.map(() => 1)
        imageOffsets.value = props.images.map(() => ({ x: 0, y: 0 }))
    }
}

/** 关闭弹窗 */
const closeDialog = () => {
    isOpen.value = false
    // 如果组件会卸载，则不需要手动重置状态
}

/** 处理上一张图片 */
const handlePrevImage = () => {
    if (currentIndex.value <= 0) return
    currentIndex.value--
    zoomLevels.value[currentIndex.value + 1] = 1
    imageOffsets.value[currentIndex.value + 1] = { x: 0, y: 0 }
}

/** 处理下一张图片 */
const handleNextImage = () => {
    if (currentIndex.value >= props.images.length - 1) return
    currentIndex.value++
    zoomLevels.value[currentIndex.value - 1] = 1
    imageOffsets.value[currentIndex.value - 1] = { x: 0, y: 0 }
}

/** 处理指示器点击 */
const handleIndicatorClick = (index: number) => {
    if (index === currentIndex.value) return
    zoomLevels.value[currentIndex.value] = 1
    imageOffsets.value[currentIndex.value] = { x: 0, y: 0 }
    currentIndex.value = index
}

// 处理滚轮缩放
const handleWheel = (event: WheelEvent, imageIndex: number) => {
    event.preventDefault()

    const zoomSpeed = 0.1
    const minZoom = 0.1
    const maxZoom = 5

    const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevels.value[imageIndex] + delta))

    zoomLevels.value[imageIndex] = newZoom
}

// 处理拖拽开始
const handleMouseDown = (event: MouseEvent, imageIndex: number) => {
    // 只有图片缩放时才允许拖拽
    // if (zoomLevels.value[imageIndex] <= 1) return

    isDragging.value = true
    dragImageIndex.value = imageIndex
    dragStartPos.value = {
        x: event.clientX - imageOffsets.value[imageIndex].x,
        y: event.clientY - imageOffsets.value[imageIndex].y,
    }
    event.preventDefault()
}

// 处理触摸开始（移动端）
const handleTouchStart = (event: TouchEvent, imageIndex: number) => {
    // 只有图片缩放时才允许拖拽
    // if (zoomLevels.value[imageIndex] <= 1) return

    isDragging.value = true
    dragImageIndex.value = imageIndex
    const touch = event.touches[0]
    dragStartPos.value = {
        x: touch.clientX - imageOffsets.value[imageIndex].x,
        y: touch.clientY - imageOffsets.value[imageIndex].y,
    }
    event.preventDefault()
}

// 处理拖拽移动
const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || dragImageIndex.value === -1) return

    const newX = event.clientX - dragStartPos.value.x
    const newY = event.clientY - dragStartPos.value.y

    imageOffsets.value[dragImageIndex.value] = { x: newX, y: newY }
}

// 处理触摸移动（移动端）
const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.value || dragImageIndex.value === -1) return

    const touch = event.touches[0]
    const newX = touch.clientX - dragStartPos.value.x
    const newY = touch.clientY - dragStartPos.value.y

    imageOffsets.value[dragImageIndex.value] = { x: newX, y: newY }
    event.preventDefault() // 防止页面滚动
}

// 处理拖拽结束
const handleMouseUp = () => {
    isDragging.value = false
    dragImageIndex.value = -1
}

// 处理触摸结束（移动端）
const handleTouchEnd = () => {
    isDragging.value = false
    dragImageIndex.value = -1
}

// 监听全局鼠标事件和触摸事件
onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
})

defineExpose({ open: openDialog, close: closeDialog, isOpen })
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogContent
            class="w-screen h-screen max-w-none overflow-hidden flex p-0 bg-transparent border-none shadow-none cursor-zoom-out"
            hide-close
        >
            <!-- 轮播容器：通过 translateX 切换图片 -->
            <div
                class="flex h-full transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(-${currentIndex * 100}vw)` }"
            >
                <!-- 图片内容 -->
                <div
                    v-for="(image, idx) in images"
                    :key="image"
                    class="w-screen h-full shrink-0 flex items-center justify-center"
                    @wheel="handleWheel($event, idx)"
                    @mousedown="handleMouseDown($event, idx)"
                    @touchstart="handleTouchStart($event, idx)"
                    @click="closeDialog"
                >
                    <img
                        :src="image"
                        class="w-auto max-w-full h-auto max-h-full object-fill cursor-pointer transition-transform ease-out select-none"
                        :style="{
                            transform: `scale(${zoomLevels[idx] || 1}) translate(${imageOffsets[idx]?.x || 0}px, ${imageOffsets[idx]?.y || 0}px)`,
                            transformOrigin: 'center center',
                        }"
                        draggable="false"
                        @click.stop
                    >
                </div>
            </div>
            <!-- 关闭按钮：fixed 相对视口定位，不受 flex/DialogContent 宽度影响 -->
            <div class="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center bg-gray-600 rounded-xl cursor-pointer">
                <Icon
                    name="cs-icon:close-bold"
                    size="18"
                    class="text-white"
                    @click="closeDialog"
                />
            </div>
            <!-- 上一张 -->
            <div
                v-if="currentIndex > 0"
                class="fixed top-1/2 -translate-y-1/2 left-6 z-50 w-15 h-15 flex items-center justify-center bg-gray-600 rounded-xl cursor-pointer"
                @click="handlePrevImage"
            >
                <Icon
                    name="cs-icon:arrow-forward-ios"
                    size="24"
                    class="text-white rotate-180"
                />
            </div>
            <!-- 下一张 -->
            <div
                v-if="currentIndex < props.images.length - 1"
                class="fixed top-1/2 -translate-y-1/2 right-6 z-50 w-15 h-15 flex items-center justify-center bg-gray-600 rounded-xl cursor-pointer"
                @click="handleNextImage"
            >
                <Icon
                    name="cs-icon:arrow-forward-ios"
                    size="24"
                    class="text-white"
                />
            </div>
            <!-- 指示器 -->
            <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
                <div
                    v-for="(image, idx) in images"
                    :key="image"
                    class="w-5 h-[5px] rounded-xl cursor-pointer"
                    :class="currentIndex === idx ? 'bg-gray-100' : 'bg-gray-600'"
                    @click="handleIndicatorClick(idx)"
                />
            </div>
        </DialogContent>
    </Dialog>
</template>
