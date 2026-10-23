<script lang="ts" setup>
import { useCmsStore } from '~/stores/cms'

const cmsStore = useCmsStore()
const { sidebarOptions, currentStatus } = storeToRefs(cmsStore)
const { setStatus } = cmsStore
</script>

<template>
    <div class="w-45 p-4">
        <div class="h-full bg-white rounded-xl p-2 space-y-2">
            <div
                v-for="option in sidebarOptions"
                :key="option.status"
                class="h-[30px] flex items-center gap-2 px-2 rounded-xl bg-gray-100 cursor-pointer transition-colors duration-150 hover:bg-gray-200"
                :class="currentStatus === option.status ? 'bg-gray-200' : ''"
                @click="setStatus(option.status)"
            >
                <div class="text-lg font-normal text-gray-700">
                    {{ option.label }}
                </div>
            </div>
        </div>
    </div>
</template>
