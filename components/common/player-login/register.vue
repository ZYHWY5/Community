<script lang="ts" setup>
import StatusBar from './components/StatusBar.vue'
import Account from './components/register/Account.vue'
import Profile from './components/register/Profile.vue'
import ActionButton from './components/ActionButton.vue'
import { useLogin } from './useLogin'
import { storeToRefs } from 'pinia'
import { RegisterStepEnum } from '~/types/login'

const { currentStep } = storeToRefs(useLogin())

const step = computed(() => {
    if (currentStep.value === RegisterStepEnum.ACCOUNT) {
        return Account
    }
    if (currentStep.value === RegisterStepEnum.PROFILE) {
        return Profile
    }
    return Account
})
</script>

<template>
    <div>
        <!-- 状态指示组件 -->
        <div>
            <StatusBar />
        </div>
        <!-- 注册步骤组件 -->
        <transition
            name="step-switch"
            mode="out-in"
        >
            <component
                :is="step"
            />
        </transition>
        <!-- 底部操作按钮 -->
        <div
            class="fixed bottom-0 left-0 right-0"
        >
            <ActionButton />
        </div>
    </div>
</template>

<style scoped>
/* 组件切换动画 */
.step-switch-enter-active,
.step-switch-leave-active {
    transition: all 0.1s ease-in-out;
}

.step-switch-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.step-switch-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.step-switch-enter-to,
.step-switch-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>
