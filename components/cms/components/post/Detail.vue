<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import MarkDownRenderer from '~/components/common/MarkDownRenderer.vue'
import { timeToText } from '~/utils/timeToText'
import { useCmsPostStore } from '~/stores/cmsPost'
import { useImagePreview } from '~/composables/useImagePreview'
import { ReviewStatusEnum } from '~/types/creator'

const cmsPostStore = useCmsPostStore()
const { postDetail } = storeToRefs(cmsPostStore)
const { reviewStatusEnumToLabel, approvePost, rejectPost } = cmsPostStore
const { t: $t } = useI18n()

/** 点击图片预览 */
const handleImgClick = (index: number) => {
    useImagePreview().open({
        images: postDetail.value?.content.imgUrl ?? [],
        index,
    })
}

/** 点击审核通过 */
const handleApprove = () => {
    if (postDetail.value) {
        approvePost(postDetail.value.id)
    }
}

/** 点击审核拒绝 */
const handleReject = () => {
    if (postDetail.value) {
        rejectPost(postDetail.value.id)
    }
}

const isOpen = ref(false)

const open = () => {
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

defineExpose({
    isOpen,
    open,
    close,
})
</script>

<template>
    <div>
        <Dialog
            :open="isOpen"
            @update:open="val => val ? open() : close()"
        >
            <DialogContent class="w-[600px] h-[600px] p-4 rounded-2xl overflow-hidden transition-[height,min-height] duration-300 ease-in-out will-change-[height] bg-white shadow-lg">
                <div
                    v-if="postDetail"
                    class="flex-1 flex flex-col min-h-0"
                >
                    <div class="flex-1 min-h-0 space-y-4 overflow-y-auto">
                        <!-- id -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.id') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.id }}
                            </div>
                        </div>
                        <!-- createTime -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.createTime') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ timeToText(postDetail.createTime) }}
                            </div>
                        </div>
                        <!-- userInfo -->
                        <div class="space-y-2">
                            <!-- 用户ID -->
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.userId') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.userInfo.id }}
                            </div>
                            <!-- 用户昵称 -->
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.userNickname') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.userInfo.nickName }}
                            </div>
                            <!-- 用户等级 -->
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.userLevel') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.userInfo.level }}
                            </div>
                            <!-- 用户头像 -->
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.userAvatar') }}
                            </div>
                            <img
                                :src="postDetail.userInfo.face"
                                class="w-10 h-10 rounded-full object-fill"
                            >
                        </div>
                        <!-- content -->
                        <div class="space-y-2">
                            <!-- title -->
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.title') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.content.title }}
                            </div>
                            <!-- imgUrl -->
                            <div class="flex items-center gap-2 overflow-x-auto">
                                <img
                                    v-for="(img, index) in postDetail.content.imgUrl"
                                    :key="index"
                                    :src="img"
                                    class="w-60 h-30 rounded-xl object-cover cursor-pointer"
                                    @click="handleImgClick(index)"
                                >
                            </div>
                            <!-- tag -->
                            <div
                                v-if="postDetail.content.tag"
                                class="space-y-2"
                            >
                                <!-- name -->
                                <div>
                                    <div class="text-lg text-gray-900">
                                        {{ $t('playerCommunity.cmsPostDetail.fields.tag') }}
                                    </div>
                                    <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                        {{ postDetail.content.tag.name }}
                                    </div>
                                </div>
                                <!-- type -->
                                <div>
                                    <div class="text-lg text-gray-900">
                                        {{ $t('playerCommunity.cmsPostDetail.fields.type') }}
                                    </div>
                                    <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                        {{ postDetail.content.tag.type }}
                                    </div>
                                </div>
                                <!-- url -->
                                <div>
                                    <div class="text-lg text-gray-900">
                                        {{ $t('playerCommunity.cmsPostDetail.fields.url') }}
                                    </div>
                                    <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                        {{ postDetail.content.tag.url }}
                                    </div>
                                </div>
                            </div>
                            <!-- content -->
                            <div>
                                <div class="text-lg text-gray-900">
                                    {{ $t('playerCommunity.cmsPostDetail.fields.content') }}
                                </div>
                                <MarkDownRenderer class="max-w-[568px]" :value="postDetail.content.content" />
                            </div>
                        </div>
                        <!-- likeCount -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.likeCount') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.likeCount }}
                            </div>
                        </div>
                        <!-- commentCount -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.commentCount') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.commentCount }}
                            </div>
                        </div>
                        <!-- collectCount -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.collectCount') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ postDetail.collectCount }}
                            </div>
                        </div>
                        <!-- reviewStatus -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsPostDetail.fields.reviewStatus') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ reviewStatusEnumToLabel(postDetail.reviewStatus) }}
                            </div>
                        </div>
                    </div>
                    <!-- 操作按钮 -->
                    <div class="flex items-center justify-end gap-2 pt-2">
                        <!-- 待审核 -->
                        <div
                            v-if="postDetail.reviewStatus === ReviewStatusEnum.PENDING"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="default"
                                @click="handleApprove"
                            >
                                {{ $t('playerCommunity.cmsPostDetail.actions.approve') }}
                            </Button>
                            <Button
                                variant="destructive"
                                @click="handleReject"
                            >
                                {{ $t('playerCommunity.cmsPostDetail.actions.reject') }}
                            </Button>
                        </div>
                        <!-- 审核通过 -->
                        <div
                            v-else-if="postDetail.reviewStatus === ReviewStatusEnum.APPROVED"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="destructive"
                                @click="handleReject"
                            >
                                {{ $t('playerCommunity.cmsPostDetail.actions.reject') }}
                            </Button>
                        </div>
                        <!-- 审核拒绝 -->
                        <div
                            v-else-if="postDetail.reviewStatus === ReviewStatusEnum.REJECTED"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="default"
                                @click="handleApprove"
                            >
                                {{ $t('playerCommunity.cmsPostDetail.actions.approve') }}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
