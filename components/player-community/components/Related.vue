<script lang="ts" setup>
import Recommend from './Recommend.vue'
import Similar from './Similar.vue'
</script>

<template>
    <div class="h-full rounded-xl">
        <component
            :is="Recommend"
        />
    </div>
</template>
