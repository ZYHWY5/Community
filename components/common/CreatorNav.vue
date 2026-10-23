<script lang="ts" setup>
import { Button } from '~/components/ui/button'
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
            <div class="w-full flex items-center gap-2 mr-4">
                <!-- <Icon
                    name="cs-icon:logo"
                    size="26"
                />
                <div>
                    |
                </div> -->
                <span class="text-xl font-semibold">
                    {{ $t('playerCommunity.creatorNav.title') }}
                </span>
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
                    {{ $t('playerCommunity.creatorNav.login') }}
                </Button>
            </div>
        </div>
    </nav>
</template>
