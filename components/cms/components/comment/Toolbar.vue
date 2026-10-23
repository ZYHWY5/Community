<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '~/components/ui/select'
import { useCmsCommentStore } from '~/stores/cmsComment'

const cmsCommentStore = useCmsCommentStore()

const { filterForm, lastFilterForm, commentStatusOptions } = storeToRefs(cmsCommentStore)
const { getCommentList, assignLastFilterForm, commentStatusEnumToLabel, resetFilterForm } = cmsCommentStore
const { paginator } = storeToRefs(cmsCommentStore)
const { t: $t } = useI18n()

const handleSearch = () => {
    if (
        filterForm.value.search === lastFilterForm.value.search
        && filterForm.value.status === lastFilterForm.value.status
    ) {
        return
    }
    paginator.value.page = 1
    void getCommentList()
    assignLastFilterForm()
}

/** 点击重置 */
const handleReset = () => {
    resetFilterForm()
}
</script>

<template>
    <div class="flex items-center gap-4 w-full h-10">
        <Input
            v-model="filterForm.search"
            :placeholder="$t('playerCommunity.cmsCommentToolbar.searchPlaceholder')"
            class="w-50 h-[30px]"
        />
        <ClientOnly>
            <Select v-model="filterForm.status">
                <SelectTrigger class="max-w-40 h-8">
                    {{ commentStatusEnumToLabel(filterForm.status) || $t('playerCommunity.cmsCommentToolbar.reviewStatus') }}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="status in commentStatusOptions"
                        :key="status.value"
                        :value="status.value"
                    >
                        {{ status.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </ClientOnly>
        <!-- 重置按钮 -->
        <Button
            class="h-[30px]"
            @click="handleReset"
        >
            {{ $t('playerCommunity.cmsCommentToolbar.reset') }}
        </Button>
        <!-- 搜索按钮 -->
        <Button
            class="h-[30px]"
            @click="handleSearch"
        >
            {{ $t('playerCommunity.cmsCommentToolbar.search') }}
        </Button>
    </div>
</template>
