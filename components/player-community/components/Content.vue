<script lang="ts" setup>
import ContentList from './ContentList.vue'
import Related from './Related.vue'
</script>

<template>
    <div class="w-full h-full flex gap-4">
        <div class="w-full md:max-w-[660px] md:w-[660px]">
            <ContentList />
        </div>
        <div class="flex-1 max-w-[356px] hidden xl:block">
            <Related />
        </div>
    </div>
</template>
