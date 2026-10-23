<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import { useCmsUserStore } from '~/stores/cmsUser'

const cmsUserStore = useCmsUserStore()

const { filterForm, lastFilterForm, previewStatusOptions, previewStatusEnumMap, userRoleOptions, userRoleEnumMap } = storeToRefs(cmsUserStore)
const { getUserList, resetFilterForm, assignLastFilterForm } = cmsUserStore
const { t: $t } = useI18n()

/** 点击搜索 */
const handleSearch = () => {
    if (filterForm.value.uid === lastFilterForm.value.uid && filterForm.value.previewStatus === lastFilterForm.value.previewStatus && filterForm.value.userRole === lastFilterForm.value.userRole) {
        return
    }
    getUserList()
    assignLastFilterForm()
}

/** 点击重置 */
const handleReset = () => {
    resetFilterForm()
}
</script>

<template>
    <div class="flex items-center gap-2 w-full h-10">
        <!-- 用户ID搜索框 -->
        <Input
            v-model="filterForm.uid"
            :placeholder="$t('playerCommunity.cmsUserToolbar.searchPlaceholder')"
            class="h-[30px] w-50"
        />
        <!-- 审核状态选择器 -->
        <ClientOnly>
            <Select v-model="filterForm.previewStatus">
                <SelectTrigger class="max-w-40 h-[30px]">
                    {{ previewStatusEnumMap }}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="status in previewStatusOptions"
                        :key="status.value"
                        :value="status.value"
                    >
                        {{ status.label }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </ClientOnly>
        <!-- 用户角色(权限)选择器 -->
        <ClientOnly>
            <Select v-model="filterForm.userRole">
                <SelectTrigger class="max-w-40 h-[30px]">
                    {{ userRoleEnumMap }}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="status in userRoleOptions"
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
            {{ $t('playerCommunity.cmsUserToolbar.reset') }}
        </Button>
        <!-- 搜索按钮 -->
        <Button
            class="h-[30px]"
            @click="handleSearch"
        >
            {{ $t('playerCommunity.cmsUserToolbar.search') }}
        </Button>
    </div>
</template>
