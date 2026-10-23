<script lang="ts" setup>
const props = defineProps<{
    modelValue: string
    options: Array<{
        label: string
        value: string
    }>
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <div>
        <div
            class="flex items-center rounded-2xl overflow-hidden bg-gray-100"
        >
            <div
                v-for="(option, index) in props.options"
                :key="index"
                class="flex-1 text-center cursor-pointer py-1 rounded-2xl transition-all ease-in-out duration-150"
                :class="option.value === props.modelValue ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
                @click="emit('update:modelValue', option.value)"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>
