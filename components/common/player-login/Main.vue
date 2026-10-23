<script lang="ts" setup>
import Login from './login.vue'
import Register from './register.vue'
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import { DialogModeEnum } from '~/types/login'
import { useLogin } from './useLogin'
import { storeToRefs } from 'pinia'

const loginStore = useLogin()
const { currentDialog, isDialogOpen } = storeToRefs(loginStore)
const { openDialog, closeDialog } = loginStore

const mode = computed(() => {
    if (currentDialog.value === DialogModeEnum.LOGIN) {
        return Login
    }
    else {
        return Register
    }
})

defineExpose({
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
})
</script>

<template>
    <div>
        <Dialog
            :open="isDialogOpen"
            @update:open="(val) => val ? openDialog() : closeDialog()"
        >
            <DialogContent
                class="w-[448px] h-[400px] min-h-[400px] p-0 rounded-2xl overflow-hidden transition-[height,min-height] duration-300 ease-in-out will-change-[height] bg-white shadow-lg"
            >
                <Transition
                    name="dialog-switch"
                    mode="out-in"
                >
                    <component
                        :is="mode"
                        :key="currentDialog"
                    />
                </Transition>
            </DialogContent>
        </Dialog>
    </div>
</template>

<style scoped>
/* 组件切换动画 */
.dialog-switch-enter-active,
.dialog-switch-leave-active {
    transition: all 0.1s ease-in-out;
}

.dialog-switch-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.dialog-switch-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.dialog-switch-enter-to,
.dialog-switch-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>
