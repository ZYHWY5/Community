<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import List from './components/List.vue'
import { useCommentStore } from '~/stores/comment'

const commentStore = useCommentStore()
const { getCommentList } = commentStore
const { hasMore, isLoading, currentPid } = storeToRefs(commentStore)

/** 列表底部哨兵：进入可视区域（或滚动根）时触发下一页 */
const sentinelRef = ref<HTMLElement | null>(null)

onMounted(() => {
    getCommentList()
})

useIntersectionObserver(
    sentinelRef,
    entries => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (!currentPid.value || isLoading.value || !hasMore.value) return
        getCommentList()
    },
    {
        /** 略提前触发，减少滑到底才请求的等待 */
        rootMargin: '0px',
    },
)
</script>

<template>
    <div>
        <List />
        <!-- 哨兵：高度可改为 h-1 便于调试；勿加 display:none -->
        <div
            ref="sentinelRef"
            class="h-px w-full shrink-0"
            aria-hidden="true"
        />
    </div>
</template>
