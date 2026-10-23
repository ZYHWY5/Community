<script setup lang="ts">
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const modelValue = defineModel<string>()
</script>

<template>
    <div class="md-editor-wrap w-full min-w-0 overflow-hidden">
        <ClientOnly>
            <MdEditor v-model="modelValue" />
        </ClientOnly>
    </div>
</template>

<style scoped>
/* 让 md-editor-v3 根元素跟随外层宽度，避免小屏溢出 */
.md-editor-wrap :deep(.md-editor) {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100%;
    box-sizing: border-box;
}
/* 工具栏、内容区在窄屏下可横向滚动，不撑破容器 */
.md-editor-wrap :deep(.md-editor-toolbar-wrapper),
.md-editor-wrap :deep(.md-editor-content-wrapper) {
    min-width: 0;
}
</style>
