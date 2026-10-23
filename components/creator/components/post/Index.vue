<script lang="ts" setup>
import FileInput from '~/components/common/fileInput/Main.vue'
import Input from '~/components/common/Input.vue'
import MarkDownEditor from '~/components/common/MarkDownEditor.vue'

const { formData, isAllowPost } = storeToRefs(useCreatorStore())
const { createPost } = useCreatorStore()
const { t: $t } = useI18n()

/** 发布帖子 */
const handlePost = () => {
    createPost()
}
</script>

<template>
    <div class="min-w-0">
        <!-- 封面 -->
        <div>
            <div>
                {{ $t('playerCommunity.creatorPost.cover') }}
            </div>
            <FileInput
                v-model="formData.resourceList"
            />
        </div>
        <!-- 标题 -->
        <div class="mt-4">
            <Input
                v-model="formData.title"
                :placeholder="$t('playerCommunity.creatorPost.titlePlaceholder')"
                class="w-full h-10"
                maxlength="50"
            />
            <div class="text-sm text-gray-500 text-right">
                {{ formData.title.length }}/50
            </div>
        </div>
        <!-- 简介 -->
        <div class="mt-4">
            <Input
                v-model="formData.desc"
                :placeholder="$t('playerCommunity.creatorPost.descriptionPlaceholder')"
                class="w-full h-10"
                maxlength="100"
            />
            <div class="text-sm text-gray-500 text-right">
                {{ formData.desc.length }}/100
            </div>
        </div>
        <!-- 正文 -->
        <div class="mt-4 w-full min-w-0">
            <MarkDownEditor
                v-model="formData.content"
                class="w-full"
            />
        </div>
        <!-- 发布按钮 -->
        <div class="mt-4 flex items-center justify-end sticky bottom-0 pb-4 pt-1 bg-white border-t">
            <Button
                class="w-16"
                :disabled="!isAllowPost"
                @click="handlePost"
            >
                {{ $t('playerCommunity.creatorPost.post') }}
            </Button>
        </div>
    </div>
</template>
