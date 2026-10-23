<script setup lang="ts">
import First from './First.vue'
import Second from './Second.vue'
import { CommentStatusEnum } from '~/types/community'

const commentStore = useCommentStore()
const playerUserStore = usePlayerUserStore()
const { commentList } = storeToRefs(commentStore)
const { confirmDeleteComment } = commentStore
const { userInfo } = storeToRefs(playerUserStore)
const { t: $t } = useI18n()

/** 删除一级评论 */
const handleDeleteComment = (id: string) => {
    confirmDeleteComment(id)
}
</script>

<template>
    <div class="space-y-4">
        <div
            v-for="item in commentList"
            :key="item.firstComment.id"
            class="animate-fade-up-d1"
        >
            <!-- 一级评论 -->
            <First :item="item.firstComment" />
            <!-- 二级评论 -->
            <Second
                v-if="item.secondComments.length > 0 && item.firstComment.status === CommentStatusEnum.NORMAL"
                :item="item.secondComments"
                :first-comment-reply-count="item.firstComment.replyCount"
            />
            <!-- 一级评论删除按钮 -->
            <div
                v-if="item.firstComment.uid === userInfo?.uid && item.firstComment.status === CommentStatusEnum.NORMAL"
                class="flex justify-end text-sm text-gray-500 cursor-pointer"
                @click="handleDeleteComment(item.firstComment.id)"
            >
                {{ $t('playerCommunity.commentList.delete') }}
            </div>
        </div>
    </div>
</template>
