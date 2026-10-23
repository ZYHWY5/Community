<script lang="ts" setup>
import { Button } from '~/components/ui/button'
import SearchInput from '../common/SearchInput.vue'
import UserFace from './UserFace.vue'
import { usePlayerUserStore } from '~/stores/player-user'
import { useLogin } from '../common/player-login/useLogin'
import { storeToRefs } from 'pinia'

const userStore = usePlayerUserStore()
const { isLogin } = storeToRefs(userStore)
const { toLogin } = useLogin()
const { t: $t } = useI18n()

const handleLogin = () => {
    toLogin()
    userStore.openLoginDialog()
}
</script>

<template>
    <nav class="hidden sm:flex w-full h-14 lg:fixed left-0 top-0 z-9 bg-white shadow-md">
        <div class="flex w-full px-12">
            <!-- Logo -->
            <div class="w-14 lg:w-48 flex items-center justify-center lg:justify-start mr-4">
                <!-- <Icon
                    name="cs-icon:logo"
                    size="26"
                /> -->
                <span class="hidden lg:block text-xl font-semibold">
                    {{ $t('playerCommunity.communityNav.title') }}
                </span>
            </div>

            <!-- 搜索框 -->
            <div class="flex items-center mr-2 xl:mr-4">
                <SearchInput
                    class="w-full"
                    input-class="w-full"
                    out-class="w-[596px] xl:w-[660px]"
                    :placeholder="$t('playerCommunity.searchPlaceholder')"
                />
            </div>

            <!-- 登录按钮 and 个人头像 -->
            <div class="xl:w-[356px] flex items-center px-2 xl:justify-end">
                <!-- 头像 -->
                <div
                    v-if="isLogin"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer"
                >
                    <!-- <img
                        v-if="userInfo.face"
                        :src="userInfo.face"
                    >
                    <Icon
                        v-else
                        name="cs-icon:user-bold"
                        size="24"
                        class="w-full h-full text-gray-400"
                    /> -->
                    <UserFace />
                </div>
                <!-- 登录按钮 -->
                <Button
                    v-else
                    @click="handleLogin"
                >
                    {{ $t('playerCommunity.communityNav.login') }}
                </Button>
            </div>
        </div>
    </nav>
</template>
