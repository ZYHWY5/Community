<script setup lang="ts">
import type { Comment } from '~/types/community'
import { CommentLevelEnum, CommentStatusEnum } from '~/types/community'
import { timeToText } from '~/utils/timeToText'

const commentStore = useCommentStore()
const { focusInput, replyComment } = commentStore
const playerUserStore = usePlayerUserStore()
const { userInfo } = storeToRefs(playerUserStore)
const { t: $t } = useI18n()

const props = defineProps<{
    item: Comment
}>()

const emit = defineEmits<{
    (e: 'delete', id: string): void
}>()

/** 回复评论 */
const handleReply = (item: Comment) => {
    focusInput()
    replyComment(CommentLevelEnum.SECOND_REPLY, {
        /** 回复二级评论的评论的root应和二级评论的root相同 */
        root: item.root ?? '',
        replyUid: item.uid,
        nickName: item.userInfo.nickName,
        level: CommentLevelEnum.SECOND_REPLY,
    })
}

/** 删除二级评论 */
const handleDelete = (id: string) => {
    emit('delete', id)
}
</script>

<template>
    <div
        v-if="props.item.status === CommentStatusEnum.NORMAL"
        class="text-sm cursor-pointer"
        @click="handleReply(props.item)"
    >
        <span class="text-blue-500">
            {{ props.item.userInfo.nickName }}
        </span>
        <span
            v-if="props.item.level === CommentLevelEnum.SECOND_REPLY"
            class="text-gray-500"
        >
            {{ $t('playerCommunity.commentSecondItem.replyTo', { name: props.item.replyUserInfo?.nickName }) }}
        </span>
        <span v-else-if="props.item.level === CommentLevelEnum.SECOND">
            :
        </span>
        <span class="break-all">
            {{ props.item.content }}
        </span>
        <span class="text-xs text-gray-500">
            &nbsp;&nbsp;{{ timeToText(props.item.createdAt) }}
        </span>
        <span
            v-if="props.item.uid === userInfo?.uid"
            class="text-xs text-gray-500 cursor-pointer"
            @click.stop="handleDelete(props.item.id)"
        >
            &nbsp;&nbsp;{{ $t('playerCommunity.commentSecondItem.delete') }}
        </span>
    </div>
</template>
