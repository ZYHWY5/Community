<script setup lang="ts">
const commentStore = useCommentStore()
const { commentInput, isFocus, textareaRef, replyTarget } = storeToRefs(commentStore)
const { postComment } = commentStore

const modelValue = defineModel<string>({ default: '' })

defineProps<{
    likeCount: number
    commentCount: number
    isLike: boolean
    isCollect: boolean
}>()

const toast = useToast()
const { t: $t } = useI18n()

/** 聚焦 */
const handleFocus = () => {
    isFocus.value = true
}

/** 失去焦点 */
const handleBlur = () => {
    isFocus.value = false
    replyTarget.value = null
}

/** 取消 */
const handleCancel = () => {
    isFocus.value = false
    commentInput.value = ''
    replyTarget.value = null
}

/** 发送 */
const handleSend = () => {
    if (!commentInput.value.trim()) {
        isFocus.value = true
        toast.error($t('playerCommunity.detailInput.toast.emptyComment'))
        return
    }
    postComment()
}

/** 关闭回复 */
const handleCloseReply = () => {
    replyTarget.value = null
}
</script>

<template>
    <div
        class="w-full flex flex-col bg-white rounded-xl overflow-hidden transition-[max-height] duration-300 ease-in-out"
        :class="isFocus ? 'max-h-[182px]' : 'max-h-[40px]'"
    >
        <div class="flex items-top">
            <!-- 输入框 -->
            <div
                class="w-full overflow-hidden transition-[max-width,max-height] duration-300 ease-in-out"
                :class="isFocus ? 'max-w-full max-h-[154px]' : 'max-w-[70%] max-h-[40px] rounded-xl'"
            >
                <div
                    v-if="replyTarget"
                    class="flex items-center justify-between bg-gray-100 p-2 rounded-t-xl text-sm font-normal text-gray-700 animate-fade-up-d1"
                >
                    {{ $t('playerCommunity.detailInput.replyTo', { name: replyTarget?.nickName }) }}
                    <Icon
                        name="cs-icon:close"
                        size="16"
                        class="cursor-pointer"
                        @mousedown.prevent
                        @click.stop="handleCloseReply"
                    />
                </div>
                <Textarea
                    :ref="(el) => { textareaRef = el as any }"
                    v-model="modelValue"
                    type="text"
                    :placeholder="$t('playerCommunity.detailInput.placeholder')"
                    maxlength="200"
                    class="w-full shrink-0 text-sm bg-gray-100 border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                    :class="replyTarget ? 'rounded-t-none' : 'rounded-xl'"
                    @focus="handleFocus"
                    @blur="handleBlur"
                />
            </div>
            <!-- 点赞、收藏、评论 按钮 -->
            <div
                class="w-full h-[40px] flex items-center overflow-hidden transition-[max-width] duration-300 ease-in-out"
                :class="isFocus ? 'max-w-0' : 'max-w-[30%]'"
            >
                <div class="flex-1 text-center cursor-pointer">
                    <Icon
                        name="cs-icon:like-regular"
                        size="16"
                    />
                    <div class="text-xs">
                        {{ likeCount }}
                    </div>
                </div>
                <div class="flex-1 text-center cursor-pointer">
                    <Icon
                        name="cs-icon:collect-regular"
                        size="16"
                    />
                    <div class="text-xs">
                        {{ $t('playerCommunity.detailInput.collect') }}
                    </div>
                </div>
                <div class="flex-1 text-center cursor-pointer">
                    <Icon
                        name="cs-icon:comment"
                        size="16"
                    />
                    <div class="text-xs">
                        {{ commentCount }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="w-full flex items-center justify-end gap-2 bg-gray-100 p-2">
            <Button
                variant="ghost"
                class="w-[70px] h-[28px] bg-gray-900 text-gray-100 hover:bg-gray-900 hover:text-gray-100 active:bg-gray-900 active:text-gray-100"
                @mousedown.prevent
                @mousedown.stop
                @click.prevent="handleSend"
            >
                {{ $t('playerCommunity.detailInput.send') }}
            </Button>
            <Button
                variant="ghost"
                class="w-[70px] h-[28px] bg-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-600 active:bg-gray-200 active:text-gray-600"
                @click.prevent="handleCancel"
            >
                {{ $t('playerCommunity.detailInput.cancel') }}
            </Button>
        </div>
    </div>
</template>
