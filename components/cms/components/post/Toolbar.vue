<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '~/components/ui/select'
import { useCmsPostStore } from '~/stores/cmsPost'

const cmsPostStore = useCmsPostStore()

const { filterForm, lastFilterForm, manageStatusOptions } = storeToRefs(cmsPostStore)
const { getPostList, assignLastFilterForm, reviewStatusEnumToLabel, resetFilterForm } = cmsPostStore
const { paginator } = storeToRefs(cmsPostStore)
const { t: $t } = useI18n()

const handleSearch = () => {
    if (
        filterForm.value.search === lastFilterForm.value.search
        && filterForm.value.status === lastFilterForm.value.status
    ) {
        return
    }
    paginator.value.page = 1
    void getPostList()
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
            :placeholder="$t('playerCommunity.cmsPostToolbar.searchPlaceholder')"
            class="w-50 h-[30px]"
        />
        <ClientOnly>
            <Select v-model="filterForm.status">
                <SelectTrigger class="max-w-40 h-8">
                    {{ reviewStatusEnumToLabel(filterForm.status) || $t('playerCommunity.cmsPostToolbar.reviewStatus') }}
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
        <!-- 重置按钮 -->
        <Button
            class="h-[30px]"
            @click="handleReset"
        >
            {{ $t('playerCommunity.cmsPostToolbar.reset') }}
        </Button>
        <!-- 搜索按钮 -->
        <Button
            class="h-[30px]"
            @click="handleSearch"
        >
            {{ $t('playerCommunity.cmsPostToolbar.search') }}
        </Button>
    </div>
</template>
