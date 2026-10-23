<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import { useLogin } from './useLogin'
import { storeToRefs } from 'pinia'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { loginFormData, isAllowLogin } = storeToRefs(useLogin())
const { toRegister, login } = useLogin()

const handleToRegister = () => {
    toRegister()
}
</script>

<template>
    <div>
        <div class="p-6">
            <!-- Logo + Name -->
            <div class="flex items-center justify-center gap-2 my-8">
                <!-- <Icon
                    name="cs-icon:annoncement-logo"
                    size="24"
                /> -->
                <span class="inline-block text-2xl font-bold">
                    {{ $t('playerCommunity.playerLoginLogin.title') }}
                </span>
            </div>
            <!-- 邮箱密码输入框 -->
            <div class="space-y-4">
                <!-- 邮箱 -->
                <Input
                    v-model="loginFormData.emailInput"
                    type="email"
                    :placeholder="$t('playerCommunity.playerLoginLogin.emailPlaceholder')"
                />
                <!-- 密码 -->
                <Input
                    v-model="loginFormData.passwordInput"
                    type="password"
                    :placeholder="$t('playerCommunity.playerLoginLogin.passwordPlaceholder')"
                />
            </div>
            <!-- 登录按钮 -->
            <div class="mt-4">
                <Button
                    class="w-full h-14 rounded-xl"
                    :disabled="!isAllowLogin"
                    @click="login"
                >
                    {{ $t('playerCommunity.playerLoginLogin.loginButton') }}
                </Button>
            </div>
            <!-- 注册按钮 -->
            <div class="mt-4 flex items-center justify-end text-primary underline">
                <a
                    @click="handleToRegister"
                >
                    {{ $t('playerCommunity.playerLoginLogin.signNewAccount') }}
                </a>
            </div>
        </div>
    </div>
</template>
