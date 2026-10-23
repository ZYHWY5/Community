<script lang="ts" setup>
import type { FileData } from '~/types/file'

const props = withDefaults(defineProps<{
    /** 文件对象 */
    file: FileData
    /** 资源列表中的索引 */
    index: number
    /** 是否允许删除 */
    isAllowDelete?: boolean
}>(), {
    isAllowDelete: true,
})

const emit = defineEmits(['fileDelete', 'fileClick'])

/** 移除资源列表中的对应文件 */
const handleDelete = () => {
    emit('fileDelete', props.index)
}

/** 点击文件(预览) */
const handleFileClick = () => {
    emit('fileClick', props.index)
}
</script>

<template>
    <div>
        <!-- 图片 -->
        <div
            class="w-40 h-[180px] relative rounded-2xl border border-gray-200 overflow-hidden cursor-pointer"
            @click="handleFileClick"
        >
            <!-- img -->
            <div
                class="h-32 flex items-center justify-center rounded-2xl"
            >
                <img
                    v-if="props.file.fileUrl"
                    :src="props.file.fileUrl"
                >
                <Icon
                    v-else
                    name="cs-icon:image-bold"
                    size="24"
                />
            </div>

            <!-- 图片信息 -->
            <div class="text-sm text-gray-600 my-1 px-2">
                <div class="line-clamp-1">
                    {{ props.file.originalName }}
                </div>
                <div class="line-clamp-1">
                    {{ (props.file.fileSize / 1024 / 1024).toFixed(2) }} MB
                </div>
            </div>

            <!-- 移除按钮 -->
            <div
                v-if="isAllowDelete"
                class="w-5 h-5 flex items-center justify-center bg-gray-200 absolute right-1 top-1 rounded-full cursor-pointer transition-colors hover:bg-gray-300"
                @click="handleDelete"
            >
                <Icon
                    name="cs-icon:close"
                    size="16"
                    class="text-gray-600"
                />
            </div>
        </div>
    </div>
</template>
