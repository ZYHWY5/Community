<script lang="ts" setup>
import Sidebar from './Sidebar.vue'
import { useCmsStore } from '~/stores/cms'

useI18n(useLang('playerCommunity'))

const cmsStore = useCmsStore()
const { currentComponent } = storeToRefs(cmsStore)
</script>

<template>
    <div class="w-full h-full flex">
        <Sidebar class="shrink-0" />
        <component
            :is="currentComponent"
            class="flex-1 min-w-0 h-full p-4 pl-0"
        />
    </div>
</template>
