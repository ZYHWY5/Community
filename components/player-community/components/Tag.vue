<script lang="ts" setup>
const props = defineProps<{
    item: {
        type: string
        name: string
        url: string
    }
}>()
</script>

<template>
    <div>
        <div class="bg-gray-100 flex items-center justify-around gap-1.5 p-0.5 rounded-[2px]">
            <!-- url -->
            <img
                :src="props.item.url"
                class="w-3.5 h-3.5 rounded-[2px] object-fill"
            >
            <span class="block text-[11px] leading-3.5 mr-1">
                {{ props.item.name }}
            </span>
        </div>
    </div>
</template>
