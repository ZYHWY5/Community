<script lang="ts" setup>
import FileItem from './components/FileItem.vue'
import type { FileData } from '~/types/file'

const props = defineProps<{
    /** 资源列表 */
    resourceList: FileData[]
}>()

const emit = defineEmits(['fileDelete', 'fileAdd'])

const fileDelete = (index: number) => {
    emit('fileDelete', index)
}

const handleFileAdd = () => {
    emit('fileAdd')
}
</script>

<template>
    <div class="h-52 flex items-center p-4 border rounded-2xl overflow-x-auto overflow-y-hidden space-x-4">
        <div
            v-for="(file, index) in props.resourceList"
            :key="index"
            class="flex items-center"
        >
            <FileItem
                :file="file"
                :index="index"
                @file-delete="fileDelete"
            />
        </div>

        <div>
            <div
                v-if="props.resourceList.length <= 5"
                class="w-40 h-[180px] rounded-2xl border border-gray-200 overflow-hidden"
            >
                <div
                    class="h-full flex items-center justify-center rounded-2xl cursor-pointer transition-colors hover:border-gray-300 hover:bg-gray-300 hover:text-gray-50"
                    @click="handleFileAdd"
                >
                    <Icon
                        name="cs-icon:add-regular"
                        size="24"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
