<script lang="ts" setup>
import Item from './Item.vue'
import { useCommunityStore } from '~/stores/community'

const { itemList } = storeToRefs(useCommunityStore())
</script>

<template>
    <div class="h-full rounded-b-xl">
        <div class="space-y-2">
            <Item
                v-for="(item, index) in itemList"
                :key="index"
                :item="item"
            />
        </div>
    </div>
</template>
