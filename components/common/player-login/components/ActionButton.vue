<script lang="ts" setup>
import Button from '~/components/ui/button/Button.vue'
import { useLogin } from '../useLogin'
import { storeToRefs } from 'pinia'
import { RegisterStepEnum } from '~/types/login'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { isAllowNext, currentStep } = storeToRefs(useLogin())
const { back, next } = useLogin()
</script>

<template>
    <div>
        <div
            class="flex items-center justify-between px-6 pb-6"
        >
            <!-- Back Button -->
            <Button
                class="px-6"
                @click="back"
            >
                {{ $t('playerCommunity.playerLoginRegisterActionButton.back') }}
            </Button>
            <!-- Next/Register Button -->
            <Button
                class="px-6"
                :disabled="!isAllowNext"
                @click="next"
            >
                {{ currentStep === RegisterStepEnum.PROFILE ? $t('playerCommunity.playerLoginRegisterActionButton.register') : $t('playerCommunity.playerLoginRegisterActionButton.next') }}
            </Button>
        </div>
    </div>
</template>
