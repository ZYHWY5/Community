<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import { cn } from '@/lib/utils'

/** 确认弹窗Props */
export interface ConfirmDialogProps {
    /** 标题 */
    title?: string
    /** 消息 */
    message?: string
    /** 确定按钮文本 */
    okText?: string
    /** 取消按钮文本 */
    cancelText?: string
    /** 确定按钮点击事件回调 */
    onOk?: () => void
    /** 取消按钮点击事件回调 */
    onCancel?: () => void
    /** 弹窗内容区域样式 */
    class?: string
}

const props = defineProps<ConfirmDialogProps>()

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

const handleOk = async () => {
    props.onOk?.()
    closeDialog()
}

const handleCancel = () => {
    props.onCancel?.()
    closeDialog()
}
</script>

<template>
    <div>
        <Dialog
            :open="isOpen"
            @update:open="(val) => val ? openDialog() : closeDialog()"
        >
            <DialogContent
                hide-close
                :class="cn('w-100 h-[150px] bg-white rounded-xl p-4 flex flex-col gap-4', props.class)"
            >
                <!-- title -->
                <div class="text-lg font-medium">
                    {{ props.title || 'Confirm' }}
                </div>

                <!-- message -->
                <div class="flex-1 overflow-y-auto">
                    {{ props.message || 'Are you sure you want to do this?' }}
                </div>

                <!-- footer -->
                <div class="flex items-end justify-end gap-2">
                    <Button
                        variant="outline"
                        @click="handleCancel"
                    >
                        {{ props.cancelText || 'Cancel' }}
                    </Button>
                    <Button
                        @click="handleOk"
                    >
                        {{ props.okText || 'OK' }}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
