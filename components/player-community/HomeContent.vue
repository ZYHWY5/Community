<script lang="ts" setup>
import RouterNav from './components/RouterNav.vue'
import Content from './components/Content.vue'
import { useCommunityStore } from '~/stores/community'

const { isShowMobileNav } = storeToRefs(useCommunityStore())
</script>

<template>
    <div
        class="flex sm:gap-4 w-full sm:h-[calc(100vh-6.5rem)] sm:mt-6 lg:mt-20 sm:px-12"
        :class="isShowMobileNav ? 'h-[calc(100vh-50px)]' : 'h-screen'"
    >
        <div>
            <RouterNav />
        </div>
        <div class="flex-1">
            <Content />
        </div>
    </div>
</template>
