<script lang="ts" setup>
const props = defineProps<{
    item: {
        imgUrl: string
        title: string
    }
}>()
</script>

<template>
    <div>
        <div class="cursor-pointer">
            <img 
                :src="props.item.imgUrl"
                class="w-[46px] h-[46px] rounded-xl object-fill mx-auto"
            >
            <span class="text-[11px] max-w-[70px] truncate block mt-2">
                {{ props.item.title }}
            </span>
        </div>
    </div>
</template>
