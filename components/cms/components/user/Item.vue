<script lang="ts" setup>
import type { UserInfo } from '~/types/cms'

const props = defineProps<{
    items: UserInfo[]
}>()

const cmsUserStore = useCmsUserStore()
const { t: $t } = useI18n()

const { previewStatusToLabel, userRoleToLabel } = cmsUserStore
const { openUserDetailDialog, getUserDetail } = cmsUserStore

/** 点击用户行 */
const handleClick = (uid: string) => {
    openUserDetailDialog()
    getUserDetail(uid)
}
</script>

<template>
    <div class="w-full">
        <table class="w-full table-fixed">
            <colgroup>
                <col style="width: 30%">
                <col style="width: 15%">
                <col style="width: 25%">
                <col style="width: 15%">
                <col style="width: 15%">
            </colgroup>
            <thead>
                <tr class="h-10 text-center border-x border-gray-200">
                    <th class="border-y border-gray-200">
                        {{ $t('playerCommunity.cmsUserItem.headers.uid') }}
                    </th>
                    <th class="border-y border-gray-200">
                        {{ $t('playerCommunity.cmsUserItem.headers.nickname') }}
                    </th>
                    <th class="border-y border-gray-200">
                        {{ $t('playerCommunity.cmsUserItem.headers.email') }}
                    </th>
                    <th class="border-y border-gray-200">
                        {{ $t('playerCommunity.cmsUserItem.headers.userRole') }}
                    </th>
                    <th class="border-y border-gray-200">
                        {{ $t('playerCommunity.cmsUserItem.headers.reviewStatus') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in props.items"
                    :key="item.uid"
                    class="h-15 text-center border-x border-gray-200 cursor-pointer transition-colors duration-300 hover:bg-gray-100"
                    @click="handleClick(item.uid)"
                >
                    <td class="border-b border-gray-200">
                        {{ item.uid }}
                    </td>
                    <td class="border-b border-gray-200">
                        {{ item.nickName }}
                    </td>
                    <td class="border-b border-gray-200">
                        {{ item.email }}
                    </td>
                    <td class="border-b border-gray-200">
                        {{ userRoleToLabel(item.userRole) }}
                    </td>
                    <td class="border-b border-gray-200">
                        {{ previewStatusToLabel(item.reviewStatus) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
