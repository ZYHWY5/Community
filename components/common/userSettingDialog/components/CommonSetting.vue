<script lang="ts" setup>
import SwitchLangue from '~/components/common/SwitchLangue.vue'

const { t: $t } = useI18n(useLang('playerCommunity'))
</script>

<template>
    <div
        class="w-full h-full overflow-hidden"
    >
        <div
            class="w-full min-w-0"
        >
            <div
                class="truncate"
            >
                {{ $t('playerCommunity.userSettingDialogCommonSetting.title') }}
            </div>

            <hr class="mt-1">

            <!-- language -->
            <div class="mt-4">
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">
                            {{ $t('playerCommunity.userSettingDialogCommonSetting.language') }}
                        </div>
                        <div class="text-xs text-gray-500 truncate">
                            {{ $t('playerCommunity.userSettingDialogCommonSetting.languageDescription') }}
                        </div>
                    </div>
                    <div class="shrink-0">
                        <SwitchLangue />
                    </div>
                    <!-- <Button
                        variant="outline"
                        size="sm"
                        class="shrink-0 max-w-[60px] text-xs rounded-2xl truncate"
                    >
                        Copy
                    </Button> -->
                </div>
            </div>
        </div>
    </div>
</template>
