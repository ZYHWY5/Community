<script lang="ts" setup>
import { cn } from '~/lib/utils'
import type { ManageResponseParams } from '~/types/creator'
// import { ReviewStatusEnum } from '~/types/creator'
import { timeToText } from '~/utils/timeToText'
import ReviewStatus from './ReviewStatus.vue'

const props = defineProps<{
    item: ManageResponseParams
    hideAction?: boolean
    class?: string
}>()

const emit = defineEmits<{
    (e: 'delete' | 'edit', id: string): void
}>()
const { t: $t } = useI18n()

const handleDelete = (id: string) => {
    emit('delete', id)
}

const handleEdit = (id: string) => {
    emit('edit', id)
}
</script>

<template>
    <!-- 外层容器 -->
    <div :class="cn('p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-all duration-300', props.class)">
        <!-- 内容 -->
        <div class="h-[70px] flex items-center justify-between">
            <!-- 左侧信息 -->
            <div class="w-full h-full flex items-center gap-4">
                <!-- 封面 -->
                <div class="w-[125px] h-full bg-gray-600 rounded-md overflow-hidden">
                    <img
                        :src="props.item.cover"
                        class="w-full h-full object-cover"
                    >
                </div>
                <!-- 信息 -->
                <div class="h-full flex flex-col justify-between">
                    <!-- 标题和日期 -->
                    <div>
                        <!-- 标题 -->
                        <div class="text-base font-medium text-gray-800">
                            {{ props.item.title }}
                        </div>
                        <!-- 日期 -->
                        <div class="text-xs text-gray-400">
                            {{ timeToText(props.item.createTime) }}
                        </div>
                    </div>
                    <!-- 点赞数和评论数和收藏数 -->
                    <div class="flex items-center gap-2">
                        <!-- 点赞数 -->
                        <div class="flex items-center gap-1 text-xs text-gray-400">
                            <Icon
                                name="cs-icon:like-blod"
                                size="13"
                            />
                            {{ props.item.likeCount }}
                        </div>
                        <!-- 评论数 -->
                        <div class="flex items-center gap-1 text-xs text-gray-400">
                            <Icon
                                name="cs-icon:comment"
                                size="13"
                            />
                            {{ props.item.commentCount }}
                        </div>
                        <!-- 收藏数 -->
                        <div class="flex items-center gap-1 text-xs text-gray-400">
                            <Icon
                                name="cs-icon:collect-bold"
                                size="13"
                            />
                            {{ props.item.collectCount }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 审核状态、操作按钮 -->
            <div
                class="shrink-0 h-full flex flex-col justify-between"
            >
                <!-- 审核状态 -->
                <ReviewStatus
                    :status="props.item.status"
                    :show-approved="false"
                />
                <!-- 操作按钮 -->
                <div
                    v-if="!props.hideAction"
                    class="flex items-center gap-2 text-xs text-gray-400"
                >
                    <div
                        class="cursor-pointer hover:text-gray-600"
                        @click="handleEdit(props.item.id)"
                    >
                        {{ $t('playerCommunity.creatorManageItem.edit') }}
                    </div>
                    <div
                        class="cursor-pointer hover:text-gray-600"
                        @click="handleDelete(props.item.id)"
                    >
                        {{ $t('playerCommunity.creatorManageItem.delete') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
