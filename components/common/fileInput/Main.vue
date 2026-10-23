<script lang="ts" setup>
import { toast } from 'vue-sonner'
import { cn } from '~/lib/utils'
import FileUpload from './FileUpload.vue'
import SourceList from './SourceList.vue'
// import { storeToRefs } from 'pinia'
// import { useLogin } from '../player-login/useLogin'
import { uploadFile } from '~/api/upload'
import type { FileData } from '~/types/file'

const props = defineProps<{
    class?: string
}>()

const resourceList = defineModel<FileData[]>({ required: true })

// const { registerFormData } = storeToRefs(useLogin())

const fileInputRef = ref<HTMLInputElement>()

const handleFileInput = () => {
    fileInputRef.value?.click()
}

/** 添加文件方法 */
const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0) {
        return
    }

    const file = files[0]
    /** 检查文件是否已存在 */
    if (resourceList.value?.find(f => f.originalName === file.name)) {
        toast.error('File already exists')
        if (fileInputRef.value) {
            fileInputRef.value.value = ''
        }
        return
    }

    try {
        const response = await uploadFile({ file })
        console.log(response)
        resourceList.value?.push({
            originalName: response.originalName,
            fileUrl: response.fileUrl,
            fileSize: response.fileSize,
        })
        toast.success('File uploaded successfully')
    }
    catch {
        toast.error('File upload failed')
    }

    // formData.value.resourceList.push(file)

    /** 重置 input value，以便可以重复选择同一文件 */
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

/** 删除对应文件 */
const handleDeleteFile = (index: number) => {
    resourceList.value?.splice(index, 1)
}
</script>

<template>
    <div :class="cn('max-w-[400px]', props.class)">
        <!-- 文件上传区域(资源列表为空时展示) -->
        <div
            v-if="resourceList.length === 0"
        >
            <FileUpload
                @file-input="handleFileInput"
            />
        </div>

        <!-- 资源列表展示区域 -->
        <div
            v-else
            class="mt-4"
        >
            <SourceList
                :resource-list="resourceList"
                @file-delete="handleDeleteFile"
                @file-add="handleFileInput"
            />
        </div>

        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
        >
    </div>
</template>
