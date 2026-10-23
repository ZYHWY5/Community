<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { copyText } from '~/utils/copyText'
import { usePlayerUserStore } from '~/stores/player-user'
import { useLogin } from '~/components/common/player-login/useLogin'
import { useUserSettingDialog } from './userSettingDialog/useUserSettingDialog'

const toast = useToast()
const { t: $t } = useI18n(useLang('playerCommunity'))

const userStore = usePlayerUserStore()
const { userInfo } = storeToRefs(userStore)

const loginStore = useLogin()
const { logout } = loginStore

const settingStore = useUserSettingDialog()
const { openDialog } = settingStore

/** 复制 UID 到剪贴板 */
const handleCopy = () => {
    if (userInfo.value.uid) {
        copyText(userInfo.value.uid)
    }
}

const handleSetting = () => {
    openDialog()
}

/** 登出 */
const handleLogOut = () => {
    logout()
    toast.success($t('playerCommunity.quickPenal.logoutSuccess'))
}
</script>

<template>
    <div>
        <!-- 头像 + 信息 -->
        <div class="flex items-center gap-2">
            <!-- 头像 -->
            <div
                class="w-[46px] h-[46px] rounded-full overflow-hidden shrink-0"
            >
                <img
                    v-if="userInfo.face"
                    :src="userInfo.face"
                    class="w-full h-full object-cover"
                >
                <Icon
                    v-else
                    name="cs-icon:user-bold"
                    size="24"
                    class="w-full h-full text-gray-400"
                />
            </div>
            <!-- nickName + uid -->
            <div class="flex-1 min-w-0">
                <!-- nickName -->
                <div class="truncate text-gray-700">
                    {{ userInfo.nickName }}
                </div>
                <!-- uid -->
                <div
                    class="flex items-center gap-1 text-xs text-gray-500"
                >
                    <div
                        class="flex-1 min-w-0 truncate"
                    >
                        {{ $t('playerCommunity.quickPenal.uidLabel') }}:{{ userInfo.uid }}
                    </div>
                    <!-- copy -->
                    <Icon
                        name="cs-icon:copy-regular"
                        size="12"
                        class="shrink-0 text-gray-400 cursor-pointer"
                        @click="handleCopy"
                    />
                </div>
            </div>
        </div>

        <hr class="mt-2">

        <!-- SettingList -->
        <div
            class="text-gray-600 mt-2"
        >
            <!-- 设置 -->
            <div
                class="flex items-center gap-2 px-2 py-1 rounded-2xl cursor-pointer transition-colors hover:bg-gray-200"
                @click="handleSetting"
            >
                <Icon
                    name="cs-icon:setting-regular"
                    size="16"
                    class="shrink-0"
                />
                <div
                    class="flex-1 min-w-0 truncate text-base"
                >
                    {{ $t('playerCommunity.quickPenal.settings') }}
                </div>
            </div>
            <!-- 退出登录 -->
            <div
                class="flex items-center gap-2 px-2 py-1 rounded-2xl cursor-pointer transition-colors hover:bg-gray-200"
                @click="handleLogOut"
            >
                <Icon
                    name="cs-icon:logout-regular"
                    size="16"
                    class="shrink-0"
                />
                <div
                    class="flex-1 min-w-0 truncate text-base"
                >
                    {{ $t('playerCommunity.quickPenal.logout') }}
                </div>
            </div>
        </div>
    </div>
</template>
