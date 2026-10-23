<script setup lang="ts">
import Home from '~/components/player-community/index.vue'

definePageMeta({
    layout: 'default',
    name: 'test',
})
</script>

<template>
    <div 
        class="min-h-screen bg-gray-100"
    >
        <Home />
    </div>
</template>

