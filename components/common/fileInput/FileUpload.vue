<script lang="ts" setup>
const { t: $t } = useI18n(useLang('playerCommunity'))

const emit = defineEmits(['fileInput'])

const handleClick = () => {
    emit('fileInput')
}
</script>

<template>
    <div>
        <div
            class="mt-4 rounded-2xl border-2 border-dashed cursor-pointer transition-colors hover:border-solid hover:border-gray-300 hover:bg-gray-300 hover:text-gray-50"
            @click="handleClick"
        >
            <div class="flex flex-col items-center py-20">
                <Icon
                    name="cs-icon:add-regular"
                    size="24"
                />
                <span class="inline-block">
                    {{ $t('playerCommunity.fileUpload.uploadFile') }}
                </span>
            </div>
        </div>
    </div>
</template>
