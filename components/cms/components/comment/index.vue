<script lang="ts" setup>
import Toolbar from './Toolbar.vue'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination'
import { useCmsCommentStore } from '~/stores/cmsComment'
import { timeToText } from '~/utils/timeToText'

const cmsCommentStore = useCmsCommentStore()
const { t: $t } = useI18n()

const { commentList, paginator } = storeToRefs(cmsCommentStore)
const { getCommentList, openCommentDetailDialog, getCommentDetail, commentStatusEnumToLabel } = cmsCommentStore

const showPagination = computed(() => {
    const { total, pageSize } = paginator.value
    if (total <= 0) {
        return false
    }
    return total > pageSize
})

const onPageChange = () => {
    void getCommentList()
}

const handleItemClick = (id: string) => {
    openCommentDetailDialog()
    void getCommentDetail(id)
}

onMounted(() => {
    void getCommentList()
})
</script>

<template>
    <div>
        <div class="flex flex-col h-full bg-white rounded-xl p-2">
            <Toolbar class="shrink-0" />
            <div class="flex-1 min-h-0 mt-2 overflow-y-auto">
                <div
                    v-for="item in commentList"
                    :key="item.id"
                    @click="handleItemClick(item.id)"
                >
                    <div class="p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-all duration-300">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3 min-w-0">
                                <img
                                    :src="item.face"
                                    class="w-9 h-9 rounded-full object-cover bg-gray-200"
                                >
                                <div class="min-w-0">
                                    <div class="text-sm text-gray-800 truncate">
                                        {{ item.nickName || '-' }}
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        {{ timeToText(item.createdAt) }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-500 shrink-0">
                                {{ commentStatusEnumToLabel(item.status) || '-' }}
                            </div>
                        </div>
                        <div class="text-sm text-gray-700 mt-2 line-clamp-2 break-all">
                            {{ item.content || '-' }}
                        </div>
                        <div class="text-xs text-gray-400 mt-2">
                            {{ $t('playerCommunity.cmsCommentIndex.idPrefix') }} {{ item.id }}
                        </div>
                    </div>
                </div>
            </div>
            <Pagination
                v-if="showPagination"
                v-model:page="paginator.page"
                class="mt-3 shrink-0 border-t border-gray-100 pt-3"
                :items-per-page="paginator.pageSize"
                :total="paginator.total"
                :sibling-count="1"
                show-edges
                @update:page="onPageChange"
            >
                <PaginationContent v-slot="{ items }">
                    <PaginationPrevious />
                    <template
                        v-for="(pItem, index) in items"
                        :key="`${pItem.type}-${index}`"
                    >
                        <PaginationEllipsis
                            v-if="pItem.type === 'ellipsis'"
                            :index="index"
                        />
                        <PaginationItem
                            v-else
                            :value="pItem.value"
                            :is-active="pItem.value === paginator.page"
                        >
                            {{ pItem.value }}
                        </PaginationItem>
                    </template>
                    <PaginationNext />
                </PaginationContent>
            </Pagination>
        </div>
    </div>
</template>
