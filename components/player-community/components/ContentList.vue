<script lang="ts" setup>
import { useCommunityStore } from '~/stores/community'

/** 当前组件（根据当前状态在列表/详情之间切换） */
const { currentComponents } = storeToRefs(useCommunityStore())
</script>

<template>
    <div class="h-full">
        <component :is="currentComponents" />
    </div>
</template>
