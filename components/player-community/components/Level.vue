<script lang="ts" setup>
const props = defineProps<{
    level: number
}>()
const { t: $t } = useI18n()
</script>

<template>
    <div>
        <div class="bg-red-500 text-white text-[8px] leading-2.5 font-semibold rounded-[2px] px-0.5">
            {{ $t('playerCommunity.level.lv') }}:{{ props.level }}
        </div>
    </div>
</template>
