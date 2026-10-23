<script lang="ts" setup>
import { useLogin } from '../useLogin'
import { RegisterStepEnum } from '~/types/login'

const { statusList } = useLogin()
const { t: $t } = useI18n(useLang('playerCommunity'))

const stepLabel = (step: RegisterStepEnum) => {
    if (step === RegisterStepEnum.ACCOUNT) {
        return $t('playerCommunity.playerLoginStore.registerStatus.account')
    }
    if (step === RegisterStepEnum.PROFILE) {
        return $t('playerCommunity.playerLoginStore.registerStatus.profile')
    }
    return step
}
</script>

<template>
    <div>
        <div class="flex items-center justify-center gap-1 py-2">
            <div
                v-for="(item, index) in statusList"
                :key="index"
                class="flex items-center gap-1 text-xs font-medium"
            >
                <div
                    class="w-6 h-1 rounded-2xl"
                    :class="item.isActive ? 'bg-primary' : 'bg-gray-300'"
                >
                </div>
                {{ stepLabel(item.label) }}
            </div>
        </div>
    </div>
</template>
