<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import { useLogin } from '../../useLogin'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { registerFormData } = useLogin()
</script>

<template>
    <div>
        <div class="p-6 space-y-4">
            <!-- 邮箱 -->
            <Input
                v-model="registerFormData.emailInput"
                class=""
                :placeholder="$t('playerCommunity.playerLoginRegisterAccount.emailPlaceholder')"
            />
            <!-- 密码 -->
            <Input
                v-model="registerFormData.passwordInput"
                type="password"
                class=""
                :placeholder="$t('playerCommunity.playerLoginRegisterAccount.passwordPlaceholder')"
            />
            <!-- 确认密码 -->
            <Input
                v-model="registerFormData.confirmPasswordInput"
                type="password"
                class=""
                :placeholder="$t('playerCommunity.playerLoginRegisterAccount.confirmPasswordPlaceholder')"
            />
        </div>
    </div>
</template>
