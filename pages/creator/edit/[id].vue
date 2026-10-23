<script lang="ts" setup>
import FileInput from '~/components/common/fileInput/Main.vue'
import Input from '~/components/common/Input.vue'
import MarkDownEditor from '~/components/common/MarkDownEditor.vue'

const { editFormData, isAllowEdit, isUpdateLoading } = storeToRefs(useCreatorStore())
const { updatePost, getEditDetail } = useCreatorStore()

const localePath = useLocalePath()

/** 更新帖子 */
const handlePost = () => {
    updatePost()
}

/** 返回 */
const handleBack = () => {
    navigateTo(localePath('/creator'))
}

onMounted(() => {
    getEditDetail()
})
</script>

<template>
    <div class="min-w-0 m-4">
        <!-- 封面 -->
        <div>
            <div>
                封面
            </div>
            <FileInput
                v-model="editFormData.resourceList"
            />
        </div>
        <!-- 标题 -->
        <div class="mt-4">
            <Input
                v-model="editFormData.title"
                placeholder="Title"
                class="w-full h-10"
                maxlength="50"
            />
            <div class="text-sm text-gray-500 text-right">
                {{ editFormData.title.length }}/50
            </div>
        </div>
        <!-- 简介 -->
        <div class="mt-4">
            <Input
                v-model="editFormData.desc"
                placeholder="Description"
                class="w-full h-10"
                maxlength="100"
            />
            <div class="text-sm text-gray-500 text-right">
                {{ editFormData.desc.length }}/100
            </div>
        </div>
        <!-- 正文 -->
        <div class="mt-4 w-full min-w-0">
            <MarkDownEditor
                v-model="editFormData.content"
                class="w-full"
            />
        </div>
        <!-- 发布按钮 -->
        <div class="mt-4 flex items-center justify-end gap-2 sticky bottom-0 pb-4 pt-1 bg-white border-t">
            <Button
                class="w-16"
                variant="outline"
                @click="handleBack"
            >
                Back
            </Button>
            <Button
                class="w-16"
                :disabled="!isAllowEdit"
                :loading="isUpdateLoading"
                @click="handlePost"
            >
                Post
            </Button>
        </div>
    </div>
</template>
