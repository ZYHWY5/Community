<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import SideBar from './SideBar.vue'
import { useUserSettingDialog } from './useUserSettingDialog'
import { storeToRefs } from 'pinia'

const { t: $t } = useI18n(useLang('playerCommunity'))
const { currentComponent } = storeToRefs(useUserSettingDialog())

const isOpen = ref(false)

const openDialog = () => {
    isOpen.value = true
}

const closeDialog = () => {
    isOpen.value = false
}

defineExpose({
    isOpen,
    open: openDialog,
    close: closeDialog,
})
</script>

<template>
    <div>
        <Dialog
            :open="isOpen"
            @update:open="(val) => val ? openDialog() : closeDialog()"
        >
            <DialogContent
                class="w-9/10 md:w-[971px] h-[734px] flex flex-col md:flex-row items-center gap-0 p-0 rounded-2xl overflow-hidden transition-[height,min-height] duration-300 ease-in-out will-change-[height] bg-white shadow-lg"
            >
                <div class="w-full p-4 md:hidden">
                    <div class="font-medium">
                        {{ $t('playerCommunity.userSettingDialogMain.configurations') }}
                    </div>
                    <hr class="mt-2">
                </div>
                <SideBar
                    class="w-full md:w-[256px] h-[64px] md:h-full shrink-0 p-2"
                />
                <Transition
                    name="dialog-switch"
                    mode="out-in"
                >
                    <component
                        :is="currentComponent"
                        class="flex-1 p-4 md:p-8"
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
}

.dialog-switch-leave-to {
    opacity: 0;
}

.dialog-switch-enter-to,
.dialog-switch-leave-from {
    opacity: 1;
}
</style>
