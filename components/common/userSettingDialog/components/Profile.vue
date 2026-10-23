<script lang="ts" setup>
import Input from '~/components/common/Input.vue'
import { uploadFile } from '~/api/upload'
import { copyText } from '~/utils/copyText'

const toast = useToast()
const { t: $t } = useI18n(useLang('playerCommunity'))

const { userInfo } = storeToRefs(usePlayerUserStore())
const { updateUserProfile } = usePlayerUserStore()

const nickNameInput = ref(userInfo.value.nickName || '')

const fileInputRef = ref<HTMLInputElement>()

/** 输入框失去焦点时触发 */
const handleBlur = async () => {
    if (nickNameInput.value.trim() === '') {
        /** 如果输入为空，重置为原来的昵称 */
        nickNameInput.value = userInfo.value.nickName || ''
        toast.error($t('playerCommunity.userSettingDialogProfile.toast.preferredNameEmpty'))
        return
    }
    if (nickNameInput.value.trim() === userInfo.value.nickName) {
        nickNameInput.value = nickNameInput.value.trim()
        /** 如果输入的昵称与原来相同，不进行更新 */
        return
    }
    /** 调用API更新用户信息 */
    await updateUserProfile({ nickName: nickNameInput.value })
}

/** 复制 UID 到剪贴板 */
const handleCopyUid = () => {
    copyText(userInfo.value.uid)
}

/** 点击头像时触发 */
const handleAvatarClick = () => {
    fileInputRef.value?.click()
}

/** 添加文件方法 */
const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0) {
        return
    }

    const file = files[0]
    /** 调用API更新用户头像 */
    try {
        const response = await uploadFile({ file })
        await updateUserProfile({ face: response.fileUrl })
        userInfo.value.face = response.fileUrl
        toast.success($t('playerCommunity.userSettingDialogProfile.toast.avatarUpdateSuccess'))
    }
    catch {
        toast.error($t('playerCommunity.userSettingDialogProfile.toast.avatarUpdateFailed'))
    }

    /** 重置 input value，以便可以重复选择同一文件 */
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}
</script>

<template>
    <div
        class="w-full h-full overflow-hidden"
    >
        <!-- 头像 + nickName -->
        <div
            class="w-full min-w-0"
        >
            <div
                class="truncate"
            >
                {{ $t('playerCommunity.userSettingDialogProfile.account') }}
            </div>

            <hr class="mt-1">

            <div
                class="mt-6 flex items-center gap-3 min-w-0"
            >
                <div
                    class="w-12 h-12 shrink-0 rounded-full overflow-hidden cursor-pointer"
                    @click="handleAvatarClick"
                >
                    <img
                        v-if="userInfo.face"
                        :src="userInfo.face"
                        class="w-full h-full object-cover"
                    >
                    <Icon
                        v-else
                        name="cs-icon:user-bold"
                        size="48"
                        class="text-gray-400"
                    />
                </div>
                <div
                    class="flex-1 min-w-0"
                >
                    <div
                        class="text-xs truncate"
                    >
                        {{ $t('playerCommunity.userSettingDialogProfile.preferredName') }}
                    </div>
                    <Input
                        v-model="nickNameInput"
                        class="w-[167px] h-7"
                        input-class="w-[167px] px-2 text-sm"
                        @blur="handleBlur"
                    />
                </div>
            </div>
        </div>

        <!-- uid + email + phone -->
        <div
            class="w-full min-w-0 mt-8"
        >
            <div
                class="truncate"
            >
                {{ $t('playerCommunity.userSettingDialogProfile.accountSecurity') }}
            </div>

            <hr class="mt-1">

            <div
                class="mt-4 min-w-0"
            >
                <!-- uid -->
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">
                            {{ $t('playerCommunity.userSettingDialogProfile.userId') }}
                        </div>
                        <div class="text-xs text-gray-500 truncate">
                            {{ userInfo.uid }}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        class="shrink-0 max-w-[60px] text-xs rounded-2xl truncate"
                        @click="handleCopyUid"
                    >
                        {{ $t('playerCommunity.userSettingDialogProfile.copy') }}
                    </Button>
                </div>

                <!-- email -->
                <div class="mt-4">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">
                            {{ $t('playerCommunity.userSettingDialogProfile.email') }}
                        </div>
                        <div class="text-xs text-gray-500 truncate">
                            {{ userInfo.email }}
                        </div>
                    </div>
                </div>

                <!-- phone -->
                <div
                    v-if="userInfo.phone"
                    class="mt-4"
                >
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">
                            {{ $t('playerCommunity.userSettingDialogProfile.phone') }}
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 truncate">
                        {{ userInfo.phone }}
                    </div>
                </div>
            </div>
        </div>

        <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
        >
    </div>
</template>
