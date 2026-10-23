<script lang="ts" setup>
import Toolbar from './Toolbar.vue'
import Item from '~/components/creator/components/manage/Item.vue'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination'
import { useCmsPostStore } from '~/stores/cmsPost'

const cmsPostStore = useCmsPostStore()

const { postList, paginator } = storeToRefs(cmsPostStore)
const { getPostList, openPostDetailDialog, getPostDetail } = cmsPostStore

const showPagination = computed(() => {
    const { total, pageSize } = paginator.value
    if (total <= 0) {
        return false
    }
    return total > pageSize
})

const onPageChange = () => {
    void getPostList()
}

const handleItemClick = (id: string) => {
    openPostDetailDialog()
    void getPostDetail(id)
}

onMounted(() => {
    void getPostList()
})
</script>

<template>
    <div>
        <div class="flex flex-col h-full bg-white rounded-xl p-2">
            <Toolbar class="shrink-0" />
            <div class="flex-1 min-h-0 mt-2 overflow-y-auto">
                <div
                    v-for="item in postList"
                    :key="item.id"
                    @click="handleItemClick(item.id)"
                >
                    <Item
                        :item="item"
                        :hideAction="true"
                    />
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
