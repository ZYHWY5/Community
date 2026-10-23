<script lang="ts" setup>
import Toolbar from './Toolbar.vue'
import Item from './Item.vue'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination'
import { useCmsUserStore } from '~/stores/cmsUser'

const cmsUserStore = useCmsUserStore()

const { userList, paginator } = storeToRefs(cmsUserStore)
const { getUserList } = cmsUserStore

/** 总页数大于 1 时才展示分页条 */
const showPagination = computed(() => {
    const { total, pageSize } = paginator.value
    if (total <= 0) {
        return false
    }
    return total > pageSize
})

const onPageChange = () => {
    void getUserList()
}

onMounted(() => {
    getUserList()
})
</script>

<template>
    <div>
        <div class="flex flex-col h-full bg-white rounded-xl p-2">
            <Toolbar class="shrink-0" />
            <div class="flex-1 min-h-0 mt-2 overflow-y-auto">
                <Item :items="userList" />
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
                        v-for="(item, index) in items"
                        :key="`${item.type}-${index}`"
                    >
                        <PaginationEllipsis
                            v-if="item.type === 'ellipsis'"
                            :index="index"
                        />
                        <PaginationItem
                            v-else
                            :value="item.value"
                            :is-active="item.value === paginator.page"
                        >
                            {{ item.value }}
                        </PaginationItem>
                    </template>
                    <PaginationNext />
                </PaginationContent>
            </Pagination>
        </div>
    </div>
</template>
