<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import Input from '~/components/common/Input.vue'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '~/components/ui/select'
import Item from './Item.vue'

const creatorStore = useCreatorStore()
const { manageFormData, manageStatusOptions, manageList, isLoadingManageList, hasMoreManageList } = storeToRefs(creatorStore)
const { getManageList, reviewStatusEnumToLabel, scrollToTop, deletePost, toEdit } = creatorStore
const { t: $t } = useI18n()

const loadMoreTriggerRef = ref<HTMLElement | null>(null)

useIntersectionObserver(
    loadMoreTriggerRef,
    ([{ isIntersecting }]) => {
        if (isIntersecting && !isLoadingManageList.value && hasMoreManageList.value) {
            getManageList()
        }
    },
    { threshold: 0, rootMargin: '0px' },
)

/** 处理搜索 */
const handleSearch = () => {
    scrollToTop()
    getManageList(true)
}

/** 处理删除 */
const handleDelete = (id: string) => {
    deletePost(id)
}

/** 处理编辑 */
const handleEdit = (id: string) => {
    toEdit(id)
}

onMounted(() => {
    getManageList()
})
</script>

<template>
    <div>
        <!-- 筛选工具栏 -->
        <div class="flex items-center gap-4 sticky top-13 z-10 pb-2 bg-white">
            <!-- 搜索框 -->
            <Input
                v-model="manageFormData.search"
                :placeholder="$t('playerCommunity.creatorManage.searchPlaceholder')"
                class="w-30 md:w-40 h-8"
            />
            <!-- 审核状态 -->
            <ClientOnly>
                <Select v-model="manageFormData.status">
                    <SelectTrigger class="max-w-40 h-8">
                        {{ reviewStatusEnumToLabel(manageFormData.status) || $t('playerCommunity.creatorManage.reviewStatus') }}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="status in manageStatusOptions"
                            :key="status.value"
                            :value="status.value"
                        >
                            {{ status.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </ClientOnly>
            <!-- 搜索按钮 -->
            <Button
                class="h-8"
                @click="handleSearch"
            >
                {{ $t('playerCommunity.creatorManage.search') }}
            </Button>
        </div>
        <!-- 帖子列表 -->
        <div>
            <Item
                v-for="item in manageList"
                :key="item.id"
                :item="item"
                @delete="handleDelete"
                @edit="handleEdit"
            />
        </div>
        <!-- 底部哨兵 -->
        <div ref="loadMoreTriggerRef"></div>
    </div>
</template>
