<script lang="ts" setup>
import { UserSettingTab } from '~/types/player-user'
import { useUserSettingDialog } from './useUserSettingDialog'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { changeTab } = useUserSettingDialog()
const { activeTab } = storeToRefs(useUserSettingDialog())

const { userInfo } = storeToRefs(usePlayerUserStore())

/** 切换设置选项卡 */
const handleChangeTab = (tab: UserSettingTab) => {
    changeTab(tab)
}
</script>

<template>
    <div
        class="flex md:flex-col overflow-x-auto bg-white md:bg-gray-100 space-x-1 md:space-y-1"
    >
        <!-- 用户信息 -->
        <div
            class="flex items-center gap-2 p-4 md:p-2 rounded-2xl cursor-pointer transition-colors hover:bg-gray-200"
            :class="activeTab === UserSettingTab.Profile ? 'bg-gray-200' : ''"
            @click="handleChangeTab(UserSettingTab.Profile)"
        >
            <div
                class="w-6 h-6 rounded-full overflow-hidden shrink-0"
            >
                <img
                    v-if="userInfo.face"
                    :src="userInfo.face"
                    class="w-full h-full object-cover"
                >
                <Icon
                    v-else
                    name="cs-icon:user-bold"
                    size="22"
                    class="text-gray-400"
                />
            </div>
            <div
                class="flex-1 truncate text-sm"
            >
                {{ $t('playerCommunity.userSettingDialogSideBar.accountInformation') }}
            </div>
        </div>
        <!-- 通用设置 -->
        <div
            class="flex items-center gap-2 p-2 rounded-2xl cursor-pointer transition-colors hover:bg-gray-200"
            :class="activeTab === UserSettingTab.GeneralSetting ? 'bg-gray-200' : ''"
            @click="handleChangeTab(UserSettingTab.GeneralSetting)"
        >
            <div
                class="w-6 h-6 rounded-full overflow-hidden shrink-0"
            >
                <Icon
                    name="cs-icon:setting-general"
                    size="22"
                    class="text-gray-400"
                />
            </div>
            <div
                class="flex-1 truncate text-sm"
            >
                {{ $t('playerCommunity.userSettingDialogSideBar.generalSettings') }}
            </div>
        </div>
    </div>
</template>
