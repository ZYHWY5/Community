<script setup lang="ts">
import Cms from '~/components/cms/index.vue'

definePageMeta({
    layout: 'default',
    name: 'cms',
})
</script>

<template>
    <div 
        class="min-h-screen bg-gray-100"
    >
        <Cms />
    </div>
</template>

