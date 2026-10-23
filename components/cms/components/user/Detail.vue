<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog'
import FileItem from '~/components/common/fileInput/components/FileItem.vue'
import { useImagePreview } from '~/composables/useImagePreview'
import { PreviewStatusEnum, UserRoleEnum } from '~/types/cms'

const cmsUserStore = useCmsUserStore()
const { userDetail, updateForm, userRoleOptions } = storeToRefs(cmsUserStore)
const { userRoleToLabel, previewStatusToLabel, updateUserDetail } = cmsUserStore
const { t: $t } = useI18n()

/** 是否编辑中 */
const isEditing = ref(false)

/** 点击文件(预览) */
const handleFileClick = (index: number) => {
    useImagePreview().open({
        images: userDetail.value?.fileData?.map(file => file.fileUrl) ?? [],
        index,
    })
}

/** 点击编辑 */
const handleEdit = () => {
    isEditing.value = true
}

/** 点击取消编辑 */
const handleCancelEdit = () => {
    isEditing.value = false
    /** 重置更新用户详情表单 */
    updateForm.value = {
        uid: userDetail.value?.uid ?? '',
        userRole: userDetail.value?.userRole ?? undefined,
        reviewStatus: userDetail.value?.reviewStatus ?? undefined,
    }
}

/** 点击更新用户详情 */
const handleUpdateUserDetail = () => {
    updateUserDetail()
    isEditing.value = false
}

/** 点击审核通过 */
const handleApprove = () => {
    if (userDetail.value) {
        updateUserDetail({
            uid: userDetail.value.uid,
            reviewStatus: PreviewStatusEnum.APPROVED,
            userRole: UserRoleEnum.USER,
        })
    }
}

/** 点击审核拒绝 */
const handleReject = () => {
    if (userDetail.value) {
        updateUserDetail({
            uid: userDetail.value.uid,
            reviewStatus: PreviewStatusEnum.REJECTED,
            userRole: UserRoleEnum.TOURIST,
        })
    }
}

const isOpen = ref(false)

const open = () => {
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

defineExpose({
    isOpen,
    open,
    close,
})
</script>

<template>
    <div>
        <Dialog
            :open="isOpen"
            @update:open="(val) => val ? open() : close()"
        >
            <DialogContent class="w-[600px] h-[600px] p-4 rounded-2xl overflow-hidden transition-[height,min-height] duration-300 ease-in-out will-change-[height] bg-white shadow-lg">
                <div
                    v-if="userDetail"
                    class="flex-1 flex flex-col min-h-0"
                >
                    <div class="flex-1 min-h-0 space-y-4 overflow-y-auto">
                        <!-- uid -->
                        <div>
                            <div class="text-lg text-gray-900">
                                {{ $t('playerCommunity.cmsUserDetail.fields.uid') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ userDetail.uid }}
                            </div>
                        </div>
                        <!-- nickName -->
                        <div>
                            <div>
                                {{ $t('playerCommunity.cmsUserDetail.fields.nickname') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ userDetail.nickName }}
                            </div>
                        </div>
                        <!-- email -->
                        <div>
                            <div>
                                {{ $t('playerCommunity.cmsUserDetail.fields.email') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ userDetail.email }}
                            </div>
                        </div>
                        <!-- phone -->
                        <div v-if="userDetail.phone">
                            <div>
                                {{ $t('playerCommunity.cmsUserDetail.fields.phone') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ userDetail.phone }}
                            </div>
                        </div>
                        <!-- userRole -->
                        <div>
                            <div>
                                {{ $t('playerCommunity.cmsUserDetail.fields.userRole') }}
                            </div>
                            <div v-if="isEditing">
                                <ClientOnly>
                                    <Select
                                        v-model="updateForm.userRole"
                                    >
                                        <SelectTrigger class="max-w-40 h-[30px]">
                                            {{ userRoleToLabel(updateForm.userRole) }}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                v-for="status in userRoleOptions"
                                                :key="status.value"
                                                :value="status.value"
                                            >
                                                {{ status.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </ClientOnly>
                            </div>
                            <div
                                v-else
                                class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2"
                            >
                                {{ userRoleToLabel(userDetail.userRole) }}
                            </div>
                        </div>
                        <!-- reviewStatus -->
                        <div>
                            <div>
                                {{ $t('playerCommunity.cmsUserDetail.fields.reviewStatus') }}
                            </div>
                            <div class="w-full h-10 bg-gray-100 text-sm text-gray-700 border border-gray-200 rounded-xl p-2">
                                {{ previewStatusToLabel(userDetail.reviewStatus) }}
                            </div>
                        </div>
                        <!-- fileData -->
                        <div class="flex items-center gap-2">
                            <FileItem
                                v-for="(file, index) in userDetail.fileData"
                                :key="index"
                                :file="file"
                                :index="index"
                                :is-allow-delete="false"
                                @file-click="handleFileClick"
                            />
                        </div>
                    </div>
                    <!-- 操作按钮 -->
                    <div class="h-10 shrink-0 flex items-center gap-2 justify-end">
                        <div
                            v-if="isEditing"
                            class="flex items-center gap-2"
                        >
                            <Button
                                variant="outline"
                                @click="handleCancelEdit"
                            >
                                {{ $t('playerCommunity.cmsUserDetail.actions.cancel') }}
                            </Button>
                            <Button
                                variant="default"
                                @click="handleUpdateUserDetail"
                            >
                                {{ $t('playerCommunity.cmsUserDetail.actions.save') }}
                            </Button>
                        </div>
                        <div
                            v-else
                            class="flex items-center gap-2"
                        >
                            <div
                                v-if="userDetail.reviewStatus === PreviewStatusEnum.PENDING"
                                class="flex items-center gap-2"
                            >
                                <Button
                                    variant="default"
                                    @click="handleApprove"
                                >
                                    {{ $t('playerCommunity.cmsUserDetail.actions.approve') }}
                                </Button>
                                <Button
                                    variant="destructive"
                                    @click="handleReject"
                                >
                                    {{ $t('playerCommunity.cmsUserDetail.actions.reject') }}
                                </Button>
                            </div>
                            <div
                                v-else-if="userDetail.reviewStatus === PreviewStatusEnum.APPROVED"
                            >
                                <Button
                                    variant="destructive"
                                    @click="handleReject"
                                >
                                    {{ $t('playerCommunity.cmsUserDetail.actions.reject') }}
                                </Button>
                            </div>
                            <div
                                v-else-if="userDetail.reviewStatus === PreviewStatusEnum.REJECTED"
                            >
                                <Button
                                    variant="default"
                                    @click="handleApprove"
                                >
                                    {{ $t('playerCommunity.cmsUserDetail.actions.approve') }}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="default"
                                    @click="handleEdit"
                                >
                                    {{ $t('playerCommunity.cmsUserDetail.actions.edit') }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>
