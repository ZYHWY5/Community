<script lang="ts" setup>
import Partition from './components/View/Partition.vue'
import ItemList from './components/View/ItemList.vue'
import Skeleton from './components/View/Skeleton.vue'
import { useCommunityStore } from '~/stores/community'

const { isLoading, paginator } = storeToRefs(useCommunityStore())
const { getCommunityList } = useCommunityStore()

onMounted(() => {
    if (paginator.value.page === 0) {
        getCommunityList()
    }
})
</script>

<template>
    <Skeleton v-if="isLoading" />
    <div
        v-else
        class="h-full flex flex-col rounded-xl overflow-y-auto"
    >
        <!-- <div>
            <Partition />
        </div> -->
        <div class="flex-1">
            <ItemList />
        </div>
    </div>
</template>
