<script setup lang="ts">
import SecondItem from './SecondItem.vue'
import type { Comment, Paginator } from '~/types/community'
import { CommentLevelEnum, CommentStatusEnum } from '~/types/community'

const commentStore = useCommentStore()
const { getSubCommentList, deleteComment } = commentStore

const props = defineProps<{
    item: Comment[]
    firstCommentReplyCount: number
}>()

const toast = useToast()
const { t: $t } = useI18n()

/** 列表接口默认只展示前 3 条，收起时始终回到该快照（须与 commentList 不同引用，否则 push 会污染快照） */
const defaultList = ref<Comment[]>(props.item.slice(0, 3))
/** 二级评论列表 */
const commentList = ref<Comment[]>([...defaultList.value])

/** 二级评论分页信息 */
const paginator = ref<Paginator>({
    total: props.firstCommentReplyCount,
    page: 0,
    pageSize: 10,
})

/** 是否还有更多二级评论 */
const hasMore = computed(() => {
    return paginator.value.page * paginator.value.pageSize < paginator.value.total
})

/** 加载更多二级评论 */
const loadMore = async () => {
    paginator.value.page += 1
    const res = await getSubCommentList(commentList.value[0].root ?? '', paginator.value.page, paginator.value.pageSize)
    if (res) {
        const diff = res.list.filter(item => !commentList.value.some(c => c.id === item.id))
        commentList.value.push(...diff)
        paginator.value = res.paginator
    }
}

/** 收起二级评论（必须拷贝快照，不能 `commentList = defaultList`，否则二次展开后 push 会改到同一份数组） */
const handleCollapse = () => {
    commentList.value = [...defaultList.value]
    paginator.value = {
        total: props.firstCommentReplyCount,
        page: 0,
        pageSize: 10,
    }
}

watch(props.item, () => {
    const diff = props.item.filter(item => !commentList.value.some(c => c.id === item.id))
    commentList.value.push(...diff)
})

/** 删除二级评论 */
const handleDelete = async (id: string) => {
    useConfirmDialog().open({
        title: $t('playerCommunity.commentSecond.confirmDelete.title'),
        message: $t('playerCommunity.commentSecond.confirmDelete.message'),
        okText: $t('playerCommunity.commentSecond.confirmDelete.okText'),
        cancelText: $t('playerCommunity.commentSecond.confirmDelete.cancelText'),
        onOk: async () => {
            try {
                const res = await deleteComment(id, CommentLevelEnum.SECOND)
                if (res) {
                    /** 更新二级评论列表 */
                    const target = commentList.value.find(item => item.id === id)
                    if (target) {
                        target.status = res.status
                    }
                    /** 更新默认列表 */
                    const defaultTarget = defaultList.value.find(item => item.id === id)
                    if (defaultTarget) {
                        defaultTarget.status = res.status
                    }
                    /** 更新分页信息 */
                    paginator.value.total -= 1
                    toast.success($t('playerCommunity.commentSecond.toast.deleteSuccess'))
                }
            }
            catch {
                toast.error($t('playerCommunity.commentSecond.toast.deleteFailed'))
            }
        },
    })
}

const normalLength = computed(() => {
    return commentList.value.filter(item => item.status === CommentStatusEnum.NORMAL).length
})
</script>

<template>
    <div
        v-if="normalLength > 0"
        class="ml-9 mt-0.5 flex"
    >
        <div class="flex-1 bg-gray-100 rounded-xl p-2">
            <div
                v-for="comment in commentList"
                :key="comment.id"
                class="text-sm animate-fade-up-d1"
            >
                <SecondItem
                    :item="comment"
                    @delete="handleDelete"
                />
            </div>
            <div
                v-if="paginator.total > 3"
                class="text-sm border-t border-gray-200 mt-2 pt-2 relative"
            >
                <div
                    v-if="hasMore"
                    class="cursor-pointer flex items-center justify-center gap-1"
                    @click="loadMore"
                >
                    <div class="text-xs text-gray-500">
                        {{ $t('playerCommunity.commentSecond.expandMore') }}
                    </div>
                    <Icon
                        name="cs-icon:expand-less"
                        size="14"
                        class="rotate-180"
                    />
                </div>
                <div
                    v-else
                    class="cursor-pointer flex items-center justify-center gap-1"
                    @click="handleCollapse"
                >
                    <div class="text-xs text-gray-500">
                        {{ $t('playerCommunity.commentSecond.collapse') }}
                    </div>
                    <Icon
                        name="cs-icon:expand-less"
                        size="14"
                    />
                </div>
                <!-- <div>
                    收起
                </div> -->
                <div
                    v-if="paginator.page > 0 && hasMore"
                    class="absolute right-0 bottom-0 text-xs text-gray-500 cursor-pointer"
                    @click="handleCollapse"
                >
                    {{ $t('playerCommunity.commentSecond.collapse') }}
                </div>
            </div>
        </div>
    </div>
</template>
