<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import { timeToText } from '~/utils/timeToText'
import { useCmsCommentStore } from '~/stores/cmsComment'
import { CommentStatusEnum } from '~/types/community'

const cmsCommentStore = useCmsCommentStore()
const { commentDetail } = storeToRefs(cmsCommentStore)
const { commentStatusEnumToLabel, approveComment, rejectComment } = cmsCommentStore
const { t: $t } = useI18n()

/** 点击审核通过 */
const handleApprove = () => {
    if (commentDetail.value) {
        approveComment(commentDetail.value.id)
    }
}

/** 点击审核拒绝 */
const handleReject = () => {
    if (commentDetail.value) {
        rejectComment(commentDetail.value.id)
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
                    v-if="commentDetail"
                    class="flex-1 flex flex-col min-h-0"
                >
                    <div class="flex-1 min-h-0 space-y-4 overflow-y-auto">
                        <!-- id -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.id') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.id }}
                            </div>
                        </div>
                        <!-- createdAt -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.createTime') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ timeToText(commentDetail.createdAt) }}
                            </div>
                        </div>
                        <!-- user -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.userNickname') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.nickName || '-' }}
                            </div>
                        </div>
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.userAvatar') }}
                            </div>
                            <img
                                :src="commentDetail.face"
                                class="w-10 h-10 rounded-full object-fill"
                            >
                        </div>
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.content') }}
                            </div>
                            <div class="w-full min-h-24 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2 whitespace-pre-wrap break-all">
                                {{ commentDetail.content || '-' }}
                            </div>
                        </div>
                        <!-- likeCount -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.likeCount') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.likeCount }}
                            </div>
                        </div>
                        <!-- replyCount -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.replyCount') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.replyCount }}
                            </div>
                        </div>
                        <!-- pid -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.postId') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.pid }}
                            </div>
                        </div>
                        <!-- root -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.rootCommentId') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.root || '-' }}
                            </div>
                        </div>
                        <!-- level -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.commentLevel') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentDetail.level }}
                            </div>
                        </div>
                        <!-- status -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsCommentDetail.fields.reviewStatus') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ commentStatusEnumToLabel(commentDetail.status) }}
                            </div>
                        </div>
                    </div>
                    <!-- 操作按钮 -->
                    <div class="flex items-center justify-end gap-2 pt-2">
                        <div
                            v-if="commentDetail.status === CommentStatusEnum.PENDING"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="default"
                                @click="handleApprove"
                            >
                                {{ $t('playerCommunity.cmsCommentDetail.actions.approve') }}
                            </Button>
                            <Button
                                variant="destructive"
                                @click="handleReject"
                            >
                                {{ $t('playerCommunity.cmsCommentDetail.actions.reject') }}
                            </Button>
                        </div>
                        <div
                            v-else-if="commentDetail.status === CommentStatusEnum.NORMAL"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="destructive"
                                @click="handleReject"
                            >
                                {{ $t('playerCommunity.cmsCommentDetail.actions.reject') }}
                            </Button>
                        </div>
                        <div
                            v-else-if="commentDetail.status === CommentStatusEnum.DELETED"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="default"
                                @click="handleApprove"
                            >
                                {{ $t('playerCommunity.cmsCommentDetail.actions.approve') }}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
