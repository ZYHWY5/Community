<script setup lang="ts">
import type { Comment } from '~/types/community'
import { timeToText } from '~/utils/timeToText'
import { CommentLevelEnum, CommentStatusEnum, LikeStatusEnum } from '~/types/community'

const commentStore = useCommentStore()
const { focusInput, replyComment, likeComment, cancelLikeComment } = commentStore

const props = defineProps<{
    item: Comment
}>()
const { t: $t } = useI18n()

/** 是否展开评论内容（用于绑定css样式） */
const isExpand = ref(false)

/** 评论内容元素 */
const contentRef = ref<HTMLElement>()

/** 是否显示展开更多/收起 */
const isShowViewMore = computed(() => {
    return contentRef.value?.scrollHeight && contentRef.value?.clientHeight && contentRef.value?.scrollHeight > contentRef.value?.clientHeight
})

/** 展开更多/收起 */
const handleViewMore = () => {
    isExpand.value = !isExpand.value
}

/** 回复评论 */
const handleReply = (item: Comment) => {
    focusInput()
    replyComment(CommentLevelEnum.SECOND, {
        root: item.id,
        replyUid: item.uid,
        nickName: item.userInfo.nickName,
        level: CommentLevelEnum.SECOND,
    })
}

/** 点赞 */
const handleLike = () => {
    if (props.item.likeStatus !== null) {
        if (props.item.likeStatus === LikeStatusEnum.LIKED) {
            cancelLikeComment(props.item.id)
        }
        else {
            likeComment(props.item.id)
        }
    }
}
</script>

<template>
    <div
        v-if="props.item.status === CommentStatusEnum.NORMAL"
        class="cursor-pointer"
        @click.stop="handleReply(props.item)"
    >
        <!-- 用户信息 + 点赞 -->
        <div class="flex items-center gap-2">
            <!-- 头像 -->
            <div class="shrink-0 flex items-center justify-center">
                <img
                    v-if="props.item.userInfo.avatar"
                    :src="props.item.userInfo.avatar"
                    class="w-7 h-7 rounded-full object-cover"
                >
                <Icon
                    v-else
                    name="cs-icon:user-bold"
                    class="rounded-full text-gray-300"
                    size="28"
                />
            </div>
            <!-- 昵称 + 等级 + 发布时间 -->
            <div class="flex-1">
                <!-- 昵称 + 等级  -->
                <div class="flex items-center gap-1">
                    <!-- 昵称 -->
                    <div class="flex-1 text-sm font-medium truncate">
                        {{ props.item.userInfo.nickName }}
                    </div>
                    <!-- 等级 -->
                    <Level
                        :level="props.item.userInfo.level"
                        class="shrink-0"
                    />
                </div>
                <!-- 发布时间 -->
                <div class="text-xs text-gray-500">
                    {{ timeToText(props.item.createdAt) }}
                </div>
            </div>
            <!-- 点赞 -->
            <div
                class="shrink-0 flex items-center gap-1"
                @click.stop="handleLike"
            >
                <Icon
                    v-if="props.item.likeStatus === LikeStatusEnum.NOT_LIKE || !props.item.likeStatus"
                    name="cs-icon:like-regular"
                    class="text-gray-500"
                    size="14"
                />
                <Icon
                    v-else
                    name="cs-icon:like-blod"
                    class="text-gray-500"
                    size="14"
                />
                <div class="text-sm text-gray-500">
                    {{ props.item.likeCount }}
                </div>
            </div>
        </div>
        <!-- 评论内容 -->
        <div class="ml-9 flex">
            <div
                ref="contentRef"
                class="flex-1 break-all"
                :class="isExpand ? 'line-clamp-none' : 'line-clamp-3'"
            >
                {{ props.item.content }}
            </div>
        </div>
        <!-- 展开更多/收起(只有内容超过3行时显示) -->
        <div
            v-if="isShowViewMore"
            class="ml-9 flex items-center justify-end text-xs"
        >
            <div
                class="cursor-pointer"
                @click.stop="handleViewMore"
            >
                {{ isExpand ? $t('playerCommunity.commentFirst.viewLess') : $t('playerCommunity.commentFirst.viewMore') }}
            </div>
        </div>
    </div>
</template>
